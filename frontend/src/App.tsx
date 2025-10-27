/**
 * App shell.
 * 
 * In a multi-page app, this would contain:
 * - Router configuration
 * - Global providers (theme, auth, etc.)
 * - Layout components (nav, sidebar)
 * 
 * For this single-page take-home, it's minimal.
 */

import React from 'react';
import { TaskPage } from './pages/TaskPage';

function App() {
  return (
    <div style={styles.app}>
      <TaskPage />
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#0d0d0d',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
};

export default App;