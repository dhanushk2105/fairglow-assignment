/**
 * Dumb component: Task input form.
 * 
 * Responsibilities:
 * - Render input field and button
 * - Handle local input state
 * - Call onAdd prop when form submitted
 * - NO API calls, NO complex logic
 */

import React, { useState, FormEvent } from 'react';

interface TaskInputProps {
  onAdd: (title: string) => Promise<void>;
  disabled?: boolean;
}

export function TaskInput({ onAdd, disabled = false }: TaskInputProps) {
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || submitting) return;

    setSubmitting(true);
    try {
      await onAdd(title);
      setTitle(''); // Clear input on success
    } catch (err) {
      // Error already handled by hook
      // Keep input value so user can retry
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        disabled={disabled || submitting}
        style={styles.input}
        autoFocus
      />
      <button
        type="submit"
        disabled={disabled || submitting || !title.trim()}
        style={styles.button}
      >
        {submitting ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    fontSize: '16px',
    border: '1px solid #333',
    borderRadius: '8px',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    outline: 'none',
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
};