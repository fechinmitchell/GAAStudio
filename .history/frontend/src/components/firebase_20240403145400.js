// Correct import statements for Firebase v9+
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBSoXlC0xwHXjqrhxTE7EBH-A9miAU956w",
    authDomain: "gaastudio-2a7ac.firebaseapp.com",
    projectId: "gaastudio-2a7ac",
    storageBucket: "gaastudio-2a7ac.appspot.com",
    messagingSenderId: "960428291533",
    appId: "1:960428291533:web:24147ecf219ed4ed0f4084",
    measurementId: "G-Y1KT9SYL7K"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);