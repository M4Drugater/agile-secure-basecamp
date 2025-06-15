
import React from 'react';
import { Navigate } from 'react-router-dom';

// Redirect to unified content studio
export default function ContentLibraryPage() {
  return <Navigate to="/content?tab=library" replace />;
}
