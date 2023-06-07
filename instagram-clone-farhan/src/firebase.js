import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDtKcq_EtqSwsyEAmwJBQJZ7GZ8_KEhudE",
  authDomain: "instagram-clone-farhan.firebaseapp.com",
  projectId: "instagram-clone-farhan",
  storageBucket: "instagram-clone-farhan.appspot.com",
  messagingSenderId: "516585034953",
  appId: "1:516585034953:web:aaaa4c0a23cb938e5aa918",
  measurementId: "G-ZF8Y29ZYYG"
});


const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
