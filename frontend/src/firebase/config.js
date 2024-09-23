import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

const firebaseConfig = {
  apiKey: "AIzaSyAzAisM7KiiZWEEIYCOxpjMgl-toHlmMSg",
  authDomain: "webapp-f9d96.firebaseapp.com",
  projectId: "webapp-f9d96",
  storageBucket: "webapp-f9d96.appspot.com",
  messagingSenderId: "721472268981",
  appId: "1:721472268981:web:69364a8f3725a5e732ecfc",
  measurementId: "G-JN1VLCCFB3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export async function uploadFile(file) {
	const storageRef = ref(storage, v4());
	return await uploadBytes(storageRef, file);
}