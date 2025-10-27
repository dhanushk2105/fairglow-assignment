/**
 * Frontend business logic for tasks.
 * 
 * This layer:
 * - Calls API layer
 * - Transforms/normalizes data
 * - Applies client-side logic (sorting, filtering, etc.)
 * - Has ZERO React dependencies (fully testable)
 * 
 * In production:
 * - Add optimistic updates
 * - Add caching/memoization
 * - Add data normalization
 * - Add offline support
 */

import { taskApi } from '../api/taskApi';
import { Task, CreateTaskRequest } from '../types/Task';

export const taskService = {
  /**
   * Fetch all tasks, sorted by creation date (newest first).
   */
  async fetchTasks(): Promise<Task[]> {
    const tasks = await taskApi.getAllTasks();
    
    // Client-side sorting by creation date
    return tasks.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  },

  /**
   * Create a new task with validation.
   */
  async createTask(title: string): Promise<Task> {
    // Client-side validation (UX improvement)
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      throw new Error('Task title cannot be empty');
    }

    if (trimmedTitle.length > 500) {
      throw new Error('Task title too long (max 500 characters)');
    }

    const request: CreateTaskRequest = { title: trimmedTitle };
    return taskApi.createTask(request);
  },

  /**
   * Toggle task completion status.
   */
  async toggleTask(taskId: string): Promise<Task> {
    return taskApi.toggleTask(taskId);
  },

  /**
   * Delete a single task.
   */
  async deleteTask(taskId: string): Promise<void> {
    return taskApi.deleteTask(taskId);
  },

  /**
   * Delete all completed tasks.
   * 
   * Returns count of deleted tasks for UX feedback.
   */
  async deleteCompletedTasks(): Promise<number> {
    const result = await taskApi.deleteCompletedTasks();
    return result.count;
  },

  /**
   * Get count of completed tasks.
   * Pure utility function.
   */
  getCompletedCount(tasks: Task[]): number {
    return tasks.filter(task => task.completed).length;
  },

  /**
   * Get count of active (incomplete) tasks.
   * Pure utility function.
   */
  getActiveCount(tasks: Task[]): number {
    return tasks.filter(task => !task.completed).length;
  },
};