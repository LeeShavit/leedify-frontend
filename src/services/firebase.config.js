import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { FIREBASE_CONFIG } from './credentials'

const app = initializeApp(FIREBASE_CONFIG)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
