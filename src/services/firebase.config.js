import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDpXv6_1_dK3zkbYVNMi0xZvLIQzMAQSbQ',
  authDomain: 'leedify-a02ad.firebaseapp.com',
  projectId: 'leedify-a02ad',
  storageBucket: 'leedify-a02ad.firebasestorage.app',
  messagingSenderId: '724445414592',
  appId: '1:724445414592:web:422c91da5898cd72665925',
  measurementId: 'G-P3FK1LTLST',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDpXv6_1_dK3zkbYVNMi0xZvLIQzMAQSbQ",
//   authDomain: "leedify-a02ad.firebaseapp.com",
//   projectId: "leedify-a02ad",
//   storageBucket: "leedify-a02ad.firebasestorage.app",
//   messagingSenderId: "724445414592",
//   appId: "1:724445414592:web:422c91da5898cd72665925",
//   measurementId: "G-P3FK1LTLST"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
