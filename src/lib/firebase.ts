import React from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

let app;
let db: any;
let auth: any;

try {
  // @ts-ignore
  const firebaseConfig = await import('../../firebase-applet-config.json').then(m => m.default).catch(() => null);
  
  if (firebaseConfig) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    auth = getAuth();
  } else {
    console.warn("Firebase config not found. Please set up Firebase in AI Studio.");
  }
} catch (e) {
  console.warn("Initializing Firebase in placeholder mode.");
}

export { db, auth };
export const googleProvider = new GoogleAuthProvider();
