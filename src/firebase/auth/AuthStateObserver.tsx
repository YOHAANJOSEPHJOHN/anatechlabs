
'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '@/firebase';

async function createSession(idToken: string) {
  await fetch('/api/auth/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken }),
  });
}

async function deleteSession() {
  await fetch('/api/auth/session', {
    method: 'DELETE',
  });
}

export function AuthStateObserver() {
  const auth = useAuth();

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        await createSession(idToken);
      } else {
        await deleteSession();
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return null; // This component does not render anything.
}
