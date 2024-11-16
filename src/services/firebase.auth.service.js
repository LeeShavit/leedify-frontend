import { signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from './firebase.config'
import { userService } from '../services/user'

export const firebaseAuthService = {
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      const userToSave = {
        _id: user.uid,
        username: user.email,
        name: user.displayName,
        email: user.email,
        imgUrl: user.photoURL,
        likedSongs: [],
        likedStations: [],
      }

      return await userService.loginWithGoogle(userToSave)
    } catch (error) {
      console.error('Error signing in with Google:', error)
      throw error
    }
  },

  async logout() {
    try {
      await signOut(auth)
      await userService.logout()
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  },
}
