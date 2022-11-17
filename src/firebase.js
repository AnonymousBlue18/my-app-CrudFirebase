import firebase from "firebase/app";
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBTZ04gfGe8E8dlzZXby6AvmQ2HTlHZ9nI",
    authDomain: "crud-viernes-10e5f.firebaseapp.com",
    projectId: "crud-viernes-10e5f",
    storageBucket: "crud-viernes-10e5f.appspot.com",
    messagingSenderId: "900666036784",
    appId: "1:900666036784:web:a96ab91fce13ffd0fd93f5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export { firebase };