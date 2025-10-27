/**
 * Dumb component: Single task row.
 * 
 * Responsibilities:
 * - Render task title, checkbox, delete button
 * - Apply completed styles
 * - Call props when user interacts
 * - NO state management, NO API calls
 */

import React from 'react';
import { Task } from '../types/Task';
import { formatRelativeTime } from '../utils/dateFormat';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <div style={styles.container}>
      <label style={styles.label}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          style={styles.checkbox}
        />
        <span style={{
          ...styles.title,
          ...(task.completed ? styles.completedTitle : {}),
        }}>
          {task.title}
        </span>
      </label>
      
      <div style={styles.meta}>
        <span style={styles.timestamp}>
          {formatRelativeTime(task.createdAt)}
        </span>
        <button
          onClick={() => onDelete(task.id)}
          style={styles.deleteButton}
          aria-label="Delete task"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    marginBottom: '8px',
    border: '1px solid #333',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    cursor: 'pointer',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    marginRight: '12px',
    cursor: 'pointer',
  },
  title: {
    fontSize: '16px',
    color: '#fff',
    transition: 'all 0.2s',
  },
  completedTitle: {
    textDecoration: 'line-through',
    color: '#666',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  timestamp: {
    fontSize: '12px',
    color: '#666',
  },
  deleteButton: {
    padding: '4px 8px',
    fontSize: '18px',
    backgroundColor: 'transparent',
    color: '#666',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
};