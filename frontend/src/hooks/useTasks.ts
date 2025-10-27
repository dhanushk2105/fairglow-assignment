/**
 * Custom React hook for task state management.
 * 
 * This hook:
 * - Manages local React state
 * - Coordinates between UI and service layer
 * - Handles loading/error states
 * - Provides clean API to components
 * 
 * Components never call services directly - they always go through hooks.
 * This makes state management centralized and predictable.
 */

import { useState, useEffect, useCallback } from 'react';
import { Task } from '../types/Task';
import { taskService } from '../services/taskService';

interface UseTasksResult {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (title: string) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  deleteCompletedTasks: () => Promise<void>;
  completedCount: number;
  activeCount: number;
}

export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load tasks on mount.
   */
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await taskService.fetchTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load tasks';
      setError(message);
      console.error('Error loading tasks:', err);
      // TODO: In production, send to error tracking service (Sentry, etc.)
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  /**
   * Add a new task.
   */
  const addTask = useCallback(async (title: string) => {
    try {
      setError(null);
      const newTask = await taskService.createTask(title);
      
      // Optimistic update: add to state immediately
      setTasks(prev => [newTask, ...prev]);
      
      // TODO: Show success toast notification
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      setError(message);
      console.error('Error creating task:', err);
      // TODO: Show error toast notification
      throw err; // Re-throw so component can handle UX
    }
  }, []);

  /**
   * Toggle task completion.
   */
  const toggleTask = useCallback(async (taskId: string) => {
    try {
      setError(null);
      
      // Optimistic update
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId
            ? { ...task, completed: !task.completed }
            : task
        )
      );

      // Sync with server
      const updatedTask = await taskService.toggleTask(taskId);
      
      // Update with server response (in case of clock skew, etc.)
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId ? updatedTask : task
        )
      );
    } catch (err) {
      // Rollback on error
      await loadTasks();
      
      const message = err instanceof Error ? err.message : 'Failed to update task';
      setError(message);
      console.error('Error toggling task:', err);
    }
  }, [loadTasks]);

  /**
   * Delete a single task.
   */
  const deleteTask = useCallback(async (taskId: string) => {
    try {
      setError(null);
      
      // Optimistic update
      setTasks(prev => prev.filter(task => task.id !== taskId));

      // Sync with server
      await taskService.deleteTask(taskId);
    } catch (err) {
      // Rollback on error
      await loadTasks();
      
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      setError(message);
      console.error('Error deleting task:', err);
    }
  }, [loadTasks]);

  /**
   * Bulk delete all completed tasks.
   */
  const deleteCompletedTasks = useCallback(async () => {
    try {
      setError(null);
      
      // Optimistic update
      setTasks(prev => prev.filter(task => !task.completed));

      // Sync with server
      const deletedCount = await taskService.deleteCompletedTasks();
      
      // TODO: Show success toast: `Deleted ${deletedCount} tasks`
      console.log(`Deleted ${deletedCount} completed tasks`);
    } catch (err) {
      // Rollback on error
      await loadTasks();
      
      const message = err instanceof Error ? err.message : 'Failed to delete completed tasks';
      setError(message);
      console.error('Error deleting completed tasks:', err);
    }
  }, [loadTasks]);

  // Compute derived state
  const completedCount = taskService.getCompletedCount(tasks);
  const activeCount = taskService.getActiveCount(tasks);

  return {
    tasks,
    loading,
    error,
    addTask,
    toggleTask,
    deleteTask,
    deleteCompletedTasks,
    completedCount,
    activeCount,
  };
}