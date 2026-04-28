// services/firebase.js — GraamVidya Firebase Integration
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from 'firebase/firestore';

// ── Firebase Configuration ──────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY            || 'AIzaSyDsmJrVqSk_eKnqb1Zp5J9-PVMg4uKldoM',
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN        || 'shikshasetu-b9164.firebaseapp.com',
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID         || 'shikshasetu-b9164',
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET     || 'shikshasetu-b9164.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID|| '765534274273',
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID             || '1:765534274273:web:bfb3b288b9a15f67226da0',
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID     || 'G-YFDNT39DHW',
};

// Prevent duplicate init in Next.js dev (hot-reload)
const app  = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// ── Auth Helpers ────────────────────────────────────────────────────────────

export async function signInWithGoogle() {
  try {
    // Try popup first (works on desktop)
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    // Upsert user doc in Firestore (skip if Firestore not set up)
    try {
      await upsertUserProfile(user.uid, {
        name: user.displayName || '',
        email: user.email || '',
        photo: user.photoURL || '',
        provider: 'google',
      });
    } catch (firestoreErr) {
      console.warn('Firestore upsert skipped:', firestoreErr.message);
    }
    return user;
  } catch (popupErr) {
    console.error('Popup sign-in error:', popupErr.code, popupErr.message);
    // If popup was blocked or closed, try redirect
    if (
      popupErr.code === 'auth/popup-blocked' ||
      popupErr.code === 'auth/popup-closed-by-user' ||
      popupErr.code === 'auth/cancelled-popup-request'
    ) {
      await signInWithRedirect(auth, googleProvider);
      return null; // redirect will reload the page
    }
    throw popupErr; // re-throw other errors
  }
}

// Call this on page load to handle redirect result
export async function handleRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      try {
        await upsertUserProfile(result.user.uid, {
          name: result.user.displayName || '',
          email: result.user.email || '',
          photo: result.user.photoURL || '',
          provider: 'google',
        });
      } catch (e) {
        console.warn('Firestore upsert skipped:', e.message);
      }
      return result.user;
    }
    return null;
  } catch (e) {
    console.error('Redirect result error:', e.code, e.message);
    return null;
  }
}

export async function registerWithEmail(email, password, displayName) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  await upsertUserProfile(cred.user.uid, {
    name: displayName,
    email: email,
    provider: 'email',
  });
  return cred.user;
}

export async function loginWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signOutUser() {
  await signOut(auth);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// ── Firestore User Profile ──────────────────────────────────────────────────

export async function upsertUserProfile(uid, data) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  } else {
    await setDoc(ref, {
      ...data,
      xp: 0,
      streak: 0,
      level: 1,
      role: 'student',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

export async function getUserProfile(uid) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? { uid, ...snap.data() } : null;
}

export async function updateUserProfile(uid, data) {
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

// ── Firestore Progress Tracking ─────────────────────────────────────────────

export async function saveProgress(uid, progressData) {
  const ref = doc(db, 'progress', uid);
  await setDoc(ref, { ...progressData, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getProgress(uid) {
  const ref = doc(db, 'progress', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// ── Firestore Leaderboard ───────────────────────────────────────────────────

export async function getLeaderboard(village = null, limitCount = 20) {
  let q;
  if (village) {
    q = query(
      collection(db, 'users'),
      where('village', '==', village),
      orderBy('xp', 'desc'),
      limit(limitCount)
    );
  } else {
    q = query(
      collection(db, 'users'),
      orderBy('xp', 'desc'),
      limit(limitCount)
    );
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
}

// ── Firestore Activity Log ──────────────────────────────────────────────────

export async function logActivity(uid, activityData) {
  const ref = doc(collection(db, 'activities'));
  await setDoc(ref, {
    uid,
    ...activityData,
    timestamp: serverTimestamp(),
  });
}

export { auth, db };
