import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAmj57w2OXJhsKC8GEEZ6oYsHf9xyU6Gz4",
    authDomain: "drafi-121e2.firebaseapp.com",
    projectId: "drafi-121e2",
    storageBucket: "drafi-121e2.appspot.com",
    messagingSenderId: "494692120130",
    appId: "1:494692120130:web:c733a06acd91f950599fdb",
    measurementId: "G-FE93VJPXV3"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleAuthProvider = new GoogleAuthProvider();