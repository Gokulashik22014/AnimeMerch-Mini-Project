
import { initializeApp } from "firebase/app";

import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"
const firebaseConfig = {
  apiKey: "AIzaSyARiRNrcwxM8torhRUcA7pd6iPjxj5J0fw",
  authDomain: "anime-merch-e06a9.firebaseapp.com",
  projectId: "anime-merch-e06a9",
  storageBucket: "anime-merch-e06a9.appspot.com",
  messagingSenderId: "597614630304",
  appId: "1:597614630304:web:b7eaadcd346a1698a780c5",
  measurementId: "G-45B2E4LRX2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth(app)//export should be done like this and not separately

export const db=getFirestore(app)//export database

export const storage=getStorage(app)//export storage