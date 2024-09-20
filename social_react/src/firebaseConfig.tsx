import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyClVlQvnsEUP6mp3bklGble3zfOi3Sz8ws",
    authDomain: "mysocial-f3eb5.firebaseapp.com",
    projectId: "mysocial-f3eb5",
    storageBucket: "mysocial-f3eb5.appspot.com",
    messagingSenderId: "919879897964",
    appId: "1:919879897964:web:0675711bedbf9898f69949",
    measurementId: "G-EN2X591VT8"
};

//khởi tạo fireBase
const app = initializeApp(firebaseConfig);

  // Khởi tạo Firebase Storage
const storage = getStorage(app);

export { storage };