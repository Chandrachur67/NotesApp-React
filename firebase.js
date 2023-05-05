// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBgJqslmSVeAmbwaCrma07wqVW8EGAr4FY",
    authDomain: "notes-react-14bb0.firebaseapp.com",
    projectId: "notes-react-14bb0",
    storageBucket: "notes-react-14bb0.appspot.com",
    messagingSenderId: "996781314932",
    appId: "1:996781314932:web:273ca8c03a417435435221"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const notesCollection = collection(db, "notes");

export { db, notesCollection }