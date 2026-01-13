import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Board } from '../components/Board';

export function BoardPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // "Back" navigates to Dashboard
  function handleBack() {
    navigate('/');
  }

  if (!projectId) {
      navigate('/');
      return null;
  }

  return (
    <Board 
        projectId={projectId} 
        onBack={handleBack} 
    />
  );
}
