import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { FIREBASE_CONFIG } from './credentials'

const firebaseConf= process.env.FIREBASE_CONFIG || FIREBASE_CONFIG

const app = initializeApp(firebaseConf)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
