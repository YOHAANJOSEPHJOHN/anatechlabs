
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';


export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      console.error("Caught Firestore Permission Error:", error.message);
      
      // Throw the error to make it visible in the Next.js error overlay during development
      if (process.env.NODE_ENV === 'development') {
        throw error;
      }
      
      // In production, you might want to show a toast or log to a monitoring service
      toast({
        variant: "destructive",
        title: "Permission Denied",
        description: "You do not have permission to perform this action.",
      });
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null; // This component does not render anything
}
