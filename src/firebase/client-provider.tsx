
'use client';

import { ReactNode } from 'react';
import { firebaseApp } from './config';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseProvider } from './provider';

// It's a provider because it has to be a client component
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  // If config is missing or incomplete, firebaseApp will be null.
  // This prevents the app from crashing and gracefully disables Firebase features.
  if (!firebaseApp) {
    return <>{children}</>;
  }

  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  
  return (
    <FirebaseProvider
      auth={auth}
      firestore={firestore}
      firebaseApp={firebaseApp}
    >
      {children}
    </FirebaseProvider>
  );
}
