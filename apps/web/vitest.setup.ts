import '@testing-library/jest-dom/vitest';
import React from 'react';

// Ensure React is available in the test environment for JSX transformed with classic runtime
// This avoids "React is not defined" in tests/components using JSX under jsx: preserve
(globalThis as any).React = React;