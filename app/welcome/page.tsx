'use client';

import { useRouter } from 'next/navigation';

export default function Welcome() {
  const router = useRouter();

  return (
    <div className="welcome-container">
      <h1 className="welcome-title">Welcome to ContentCraft-Inspector</h1>
      <p className="welcome-subtitle">Sign up or log in to get started.</p>

      <div className="space-x-4">
        <button onClick={() => router.push('/auth/signup')} className="btn btn-primary">
          Sign Up
        </button>
        <button onClick={() => router.push('/auth/login')} className="btn btn-secondary">
          Log In
        </button>
      </div>
    </div>
  );
}
