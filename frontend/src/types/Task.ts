/**
 * Core Task type matching backend API contract.
 * 
 * Using ISO 8601 string for dates to match JSON serialization.
 * In a real app, might use a date library like date-fns for parsing.
 */
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string; // ISO 8601 timestamp
}

/**
 * DTO for creating a new task.
 * ID and timestamps are server-generated.
 */
export interface CreateTaskRequest {
  title: string;
}