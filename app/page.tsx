'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/welcome'); // Redirect to welcome page by default
  }, [router]);

  return null; // Nothing to render, just redirecting
}
