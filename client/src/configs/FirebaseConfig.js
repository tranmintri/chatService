import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBDLEYNT-cd7nO_FuN6kaCa_xRcASzUDco",
  authDomain: "chatservice-d1f1c.firebaseapp.com",
  projectId: "chatservice-d1f1c",
  storageBucket: "chatservice-d1f1c.appspot.com",
  messagingSenderId: "323769795362",
  appId: "1:323769795362:web:f6b3e9c7697a5227dbdb7b",
  measurementId: "G-W609RPCZY2",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleAuthProvider = new GoogleAuthProvider();
export const firestoreDB = firebase.firestore();
