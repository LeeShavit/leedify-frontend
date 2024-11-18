import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { FIREBASE_CONFIG } from './credentials'

const firebaseConf= import.meta.env.FIREBASE_CONFIG || FIREBASE_CONFIG

const config = JSON.parse(firebaseConf)

const app = initializeApp(config)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
