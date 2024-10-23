import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth"; // Import necessary Firebase Auth functions
import { getFirestore } from 'firebase/firestore'; 


const firebaseConfig = {
	apiKey: "AIzaSyAmaSRIvpKgdqgOrg4MSIfRk_gCV9l0NME",
	authDomain: "netriskauth.firebaseapp.com",
	projectId: "netriskauth",
	storageBucket: "netriskauth.appspot.com",
	messagingSenderId: "416479825642",
	appId: "1:416479825642:web:eb7eac66f88741e046d193",
	measurementId: "G-3KP6TPRB83",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firebase Auth
const auth = getAuth(app);

setPersistence(auth, browserSessionPersistence)
	.then(() => {
		
	})
	.catch((error) => {
		console.error("Error setting persistence:", error);
	});
	
const db = getFirestore(app); // Initialize Firestore and assign it to db



export { auth, db };

