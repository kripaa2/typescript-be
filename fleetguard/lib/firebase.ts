import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDaGzTLQ8f9gYRc1pgniD_L75GCaw3c1fU",
  authDomain: "assignment-aa85a.firebaseapp.com",
  projectId: "assignment-aa85a",
  storageBucket: "assignment-aa85a.firebasestorage.app",
  messagingSenderId: "544813129965",
  appId: "1:544813129965:web:9fd9305f969b46ba66ece4",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);