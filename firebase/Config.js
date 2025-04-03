import { initializeApp } from "firebase/app";
import { onSnapshot, query, getFirestore,collection,addDoc, serverTimestamp, doc, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJgpVd1VhzloxY40QDhBrThXkgyT6Xrs0",
  authDomain: "koulutyo-c22d1.firebaseapp.com",
  projectId: "koulutyo-c22d1",
  storageBucket: "koulutyo-c22d1.firebasestorage.app",
  messagingSenderId: "665072560630",
  appId: "1:665072560630:web:75a565ed3c86304ad67fd7"
};

initializeApp(firebaseConfig);

const firestore = getFirestore();

const MESSAGES = 'messages';

export {
  firestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  onSnapshot,
  deleteDoc,
  doc,
  MESSAGES
}