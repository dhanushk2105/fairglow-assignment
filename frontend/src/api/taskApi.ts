/**
 * Task-specific API client.
 * 
 * This layer:
 * - Defines API endpoints for task operations
 * - Maps to backend routes
 * - Returns typed responses
 * - Has NO business logic (just transport)
 * 
 * Easy to mock for testing services/hooks.
 */

import { httpClient } from './httpClient';
import { Task, CreateTaskRequest } from '../types/Task';

export const taskApi = {
  /**
   * Fetch all tasks.
   */
  getAllTasks: async (): Promise<Task[]> => {
    return httpClient.get<Task[]>('/tasks');
  },

  /**
   * Create a new task.
   */
  createTask: async (request: CreateTaskRequest): Promise<Task> => {
    return httpClient.post<Task>('/tasks', request);
  },

  /**
   * Toggle task completion status.
   */
  toggleTask: async (taskId: string): Promise<Task> => {
    return httpClient.patch<Task>(`/tasks/${taskId}`);
  },

  /**
   * Delete a single task.
   */
  deleteTask: async (taskId: string): Promise<void> => {
    await httpClient.delete(`/tasks/${taskId}`);
  },

  /**
   * Bulk delete all completed tasks.
   */
  deleteCompletedTasks: async (): Promise<{ count: number }> => {
    return httpClient.delete<{ count: number }>('/tasks/completed');
  },
};