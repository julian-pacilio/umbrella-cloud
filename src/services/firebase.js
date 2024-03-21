// This file contains Firebase services we will use and export them to further usages
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6OTUMhdJqBGEf7btyweeIbN3bMXZdeo4",
  authDomain: "dwn4av-cwm-pacilio-julian.firebaseapp.com",
  projectId: "dwn4av-cwm-pacilio-julian",
  storageBucket: "dwn4av-cwm-pacilio-julian.appspot.com",
  messagingSenderId: "180073835432",
  appId: "1:180073835432:web:940fdb890f1d7980640b9d",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Instance of Firestore
export const db = getFirestore(app);

// Instance of Authentication
export const auth = getAuth(app);

// Instance of Storage
export const storage = getStorage(app);