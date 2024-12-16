import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { FB_API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from './credentials'

export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.FB_API_KEY || FB_API_KEY,
  authDomain: import.meta.env.AUTH_DOMAIN || AUTH_DOMAIN,
  projectId: import.meta.env.PROJECT_ID || PROJECT_ID,
  storageBucket: import.meta.env.STORAGE_BUCKET || STORAGE_BUCKET,
  messagingSenderId: import.meta.env.MESSAGING_SENDER_ID || MESSAGING_SENDER_ID,
  appId: import.meta.env.APP_ID || APP_ID,
}

const app = initializeApp(FIREBASE_CONFIG)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
