import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import {
  getAnalytics,
  isSupported,
  logEvent,
  type Analytics,
} from "firebase/analytics"

// Configuración de Firebase para la web
const firebaseConfig = {
  apiKey: "AIzaSyAHDzU6PnlUSsRU8kCQK5iZyA_2r9fBgS4",
  authDomain: "valentinedayletter.firebaseapp.com",
  projectId: "valentinedayletter",
  storageBucket: "valentinedayletter.firebasestorage.app",
  messagingSenderId: "966723923902",
  appId: "1:966723923902:web:7313806c25a923613013ef",
  measurementId: "G-2STVH53L7H",
}

let analyticsPromise: Promise<Analytics | null> | null = null

function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null
  return getApps().length ? getApp() : initializeApp(firebaseConfig)
}

export function initAnalytics(): Promise<Analytics | null> | null {
  if (typeof window === "undefined") return null

  if (!analyticsPromise) {
    analyticsPromise = isSupported()
      .then((supported) => {
        if (!supported) return null
        const app = getFirebaseApp()
        if (!app) return null
        return getAnalytics(app)
      })
      .catch(() => null)
  }

  return analyticsPromise
}

export async function trackEvent(
  name: string,
  params?: Record<string, unknown>
): Promise<void> {
  const analytics = await initAnalytics()
  if (!analytics) return
  try {
    logEvent(analytics, name, params)
  } catch {
    // Evitar que un fallo de analytics rompa la UI
  }
}

