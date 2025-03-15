
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyBnOInpt4HCNMt4sbCxmJ20itutj7U3TMQ",
    authDomain: "my-firebase-7eed8.firebaseapp.com",
    databaseURL: "https://my-firebase-7eed8-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "my-firebase-7eed8",
    storageBucket: "my-firebase-7eed8.firebasestorage.app",
    messagingSenderId: "576338172397",
    appId: "1:576338172397:web:adb47d5137a87bc4e32fe4",
    measurementId: "G-SN02KTCY9T"
  };

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export default messaging