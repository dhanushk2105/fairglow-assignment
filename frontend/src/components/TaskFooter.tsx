/**
 * Dumb component: Footer with stats and bulk actions.
 * 
 * Responsibilities:
 * - Display task counts
 * - Render "Clear completed" button
 * - Call onClearCompleted prop
 * - NO state, NO API calls
 */

import React from 'react';

interface TaskFooterProps {
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}

export function TaskFooter({
  activeCount,
  completedCount,
  onClearCompleted,
}: TaskFooterProps) {
  return (
    <div style={styles.footer}>
      <div style={styles.stats}>
        <span style={styles.stat}>
          {activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining
        </span>
        {completedCount > 0 && (
          <span style={styles.stat}>
            {completedCount} completed
          </span>
        )}
      </div>
      
      {completedCount > 0 && (
        <button
          onClick={onClearCompleted}
          style={styles.clearButton}
        >
          Clear Completed
        </button>
      )}
    </div>
  );
}

const styles = {
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    border: '1px solid #333',
  },
  stats: {
    display: 'flex',
    gap: '16px',
  },
  stat: {
    fontSize: '14px',
    color: '#666',
  },
  clearButton: {
    padding: '8px 16px',
    fontSize: '14px',
    backgroundColor: 'transparent',
    color: '#dc3545',
    border: '1px solid #dc3545',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};