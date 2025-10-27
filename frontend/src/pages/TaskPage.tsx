/**
 * Page-level orchestrator.
 * 
 * Responsibilities:
 * - Use hooks to get data and actions
 * - Compose dumb components
 * - Handle page-level loading/error states
 * - Pass callbacks down to components
 * 
 * This is the "smart" component that coordinates everything.
 */

import React from 'react';
import { useTasks } from '../hooks/useTasks';
import { TaskInput } from '../components/TaskInput';
import { TaskList } from '../components/TaskList';
import { TaskFooter } from '../components/TaskFooter';

export function TaskPage() {
  const {
    tasks,
    loading,
    error,
    addTask,
    toggleTask,
    deleteTask,
    deleteCompletedTasks,
    completedCount,
    activeCount,
  } = useTasks();

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Task Tracker</h1>
        <p style={styles.subtitle}>
          Simple, fast, and organized.
        </p>
      </header>

      {error && (
        <div style={styles.error}>
          <p style={styles.errorText}>⚠️ {error}</p>
        </div>
      )}

      <div style={styles.content}>
        <TaskInput onAdd={addTask} disabled={loading} />

        {loading && tasks.length === 0 ? (
          <div style={styles.loading}>
            <p style={styles.loadingText}>Loading tasks...</p>
          </div>
        ) : (
          <>
            <TaskList
              tasks={tasks}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
            
            {tasks.length > 0 && (
              <TaskFooter
                activeCount={activeCount}
                completedCount={completedCount}
                onClearCompleted={deleteCompletedTasks}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '24px',
  },
  header: {
    marginBottom: '32px',
    textAlign: 'center' as const,
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    margin: 0,
  },
  content: {
    // Main content area
  },
  error: {
    padding: '12px 16px',
    marginBottom: '16px',
    backgroundColor: '#dc35451a',
    border: '1px solid #dc3545',
    borderRadius: '8px',
  },
  errorText: {
    color: '#dc3545',
    margin: 0,
    fontSize: '14px',
  },
  loading: {
    padding: '48px 24px',
    textAlign: 'center' as const,
  },
  loadingText: {
    fontSize: '16px',
    color: '#666',
    margin: 0,
  },
};