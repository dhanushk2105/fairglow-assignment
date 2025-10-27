/**
 * Dumb component: Task list container.
 * 
 * Responsibilities:
 * - Render list of TaskItem components
 * - Show empty state
 * - Pass through callbacks
 * - NO data fetching, NO state management
 */

import React from 'react';
import { Task } from '../types/Task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyText}>No tasks yet. Add one above! 👆</p>
      </div>
    );
  }

  return (
    <div style={styles.list}>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

const styles = {
  list: {
    marginBottom: '24px',
  },
  empty: {
    padding: '48px 24px',
    textAlign: 'center' as const,
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    border: '1px solid #333',
  },
  emptyText: {
    fontSize: '16px',
    color: '#666',
    margin: 0,
  },
};