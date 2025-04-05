import { initializeApp } from "firebase/app";
import { onSnapshot, query, getFirestore,collection,addDoc, serverTimestamp, doc, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  //api keys here
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
