// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {getAuth} from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpLJSA2BNWDefigz0GHs3Hc6H2b7_4LnI",
  authDomain: "tkmore-62aa9.firebaseapp.com",
  projectId: "tkmore-62aa9",
  storageBucket: "tkmore-62aa9.appspot.com",
  messagingSenderId: "396904267765",
  appId: "1:396904267765:web:29a54ccfee58202547aabc",
  measurementId: "G-XF5CWG0DJN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(fApp);
const auth = getAuth(fApp)
export { db, auth };