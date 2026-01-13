import React from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setToken } from '../api.js';
import { useModal } from '../components/Modal';
import { AuthCard } from '../components/AuthCard';

export function LoginPage() {
  const navigate = useNavigate();
  const { alert } = useModal();

  function onAuthed() {
    navigate('/');
  }

  return <AuthCard onAuthed={onAuthed} />;
}
