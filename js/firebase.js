// ============================================================
//  js/firebase.js — Gene's Lechon Landing Page
//  Uses your existing Firebase project: pos-and-sales-monitoring
// ============================================================

import { initializeApp }    from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAnalytics }     from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";
import { getAuth }          from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import {
  getStorage,
  ref as sRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

// ── Your Firebase config (same project as your POS) ──────────
const firebaseConfig = {
  apiKey:            "AIzaSyBvsn9hLvi4Tq9mLvoo1-YL1uzbB_ntL7s",
  authDomain:        "pos-and-sales-monitoring.firebaseapp.com",
  projectId:         "pos-and-sales-monitoring",
  storageBucket:     "pos-and-sales-monitoring.firebasestorage.app",
  messagingSenderId: "516453934117",
  appId:             "1:516453934117:web:1783067b8aa6b37373cbcc",
  measurementId:     "G-FT1G64DB9N",
  databaseURL:       "https://pos-and-sales-monitoring-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// ── Initialize ────────────────────────────────────────────────
const app       = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db        = getFirestore(app);
const storage   = getStorage(app);
const auth      = getAuth(app);
const rtdb      = getDatabase(app);

// ── Chatbot proxy URL ─────────────────────────────────────────
// After you deploy the Cloud Function, paste its URL here.
// It will look like:
// https://chatproxy-xxxxxxxx-as.a.run.app
// You can find it in: Firebase Console → Functions → chatProxy → Trigger URL
export const CHAT_PROXY_URL = "https://YOUR_REGION-pos-and-sales-monitoring.cloudfunctions.net/chatProxy";

// ── Exports ───────────────────────────────────────────────────
export {
  app,
  analytics,
  db,
  storage,
  auth,
  rtdb,
  ref,
  set,
  onValue,
  remove,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  sRef,
  uploadBytes,
  getDownloadURL,
  setDoc
};