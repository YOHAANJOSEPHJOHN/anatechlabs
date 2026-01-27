
'use client';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseApp } from './config';
import { useUser } from './auth/use-user';
import {
  useAuth,
  useFirestore,
  useFirebaseApp,
} from './provider';

// Defensively initialize auth and firestore. They will be null if config is missing.
const auth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null;
const firestore: Firestore | null = firebaseApp ? getFirestore(firebaseApp) : null;

export {
  auth,
  firestore,
  useUser,
  useAuth,
  useFirestore,
  useFirebaseApp,
};
