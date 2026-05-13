/* ═══════════════════════════════════════════════════════════════════
   Firebase Configuration — HydroTrack
   ═══════════════════════════════════════════════════════════════════ */

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDa_SoW6I05OBv8HQ18Y0aciZYhaW2tV9Y",
  authDomain: "hydrotrack-5b066.firebaseapp.com",
  projectId: "hydrotrack-5b066",
  storageBucket: "hydrotrack-5b066.firebasestorage.app",
  messagingSenderId: "991582379739",
  appId: "1:991582379739:web:0231a3b81fabef5c7036fe",
  measurementId: "G-FJ4VT12QVK"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export default app
