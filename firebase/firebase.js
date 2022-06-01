

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "@react-native-firebase/auth";
import { getStorage } from "@react-native-firebase/app";
import firestore,{firebase} from '@react-native-firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyBZkh8nkvgcv6HUWCftIJPkuSZANMvlVLU",
    authDomain: "tathuheo.firebaseapp.com",
    databaseURL: "https://tathuheo-default-rtdb.firebaseio.com",
    projectId: "tathuheo",
    storageBucket: "tathuheo.appspot.com",
    messagingSenderId: "65211879809",
    appId: "1:277423826521:android:baf9811bf6ad9c4cd9f348",
    measurementId: "277423826521"
  };

  
export const app = firebase.initializeApp(firebaseConfig);
firebase.initializeApp({
    apiKey: "AIzaSyBZkh8nkvgcv6HUWCftIJPkuSZANMvlVLU",
    authDomain: "tathuheo.firebaseapp.com",
    databaseURL: "https://tathuheo-default-rtdb.firebaseio.com",
    projectId: "tathuheo",
    storageBucket: "tathuheo.appspot.com",
    messagingSenderId: "65211879809",
    appId: "1:277423826521:android:baf9811bf6ad9c4cd9f348",
    measurementId: "277423826521"
})


export default firebase