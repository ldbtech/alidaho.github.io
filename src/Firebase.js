import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDBbUVMlSQZjfjECQR5HeUOPAuivUunHRE",
    authDomain: "portfolio-deb66.firebaseapp.com",
    databaseURL: "https://portfolio-deb66-default-rtdb.firebaseio.com",
    projectId: "portfolio-deb66",
    storageBucket: "portfolio-deb66.appspot.com",
    messagingSenderId: "876517418051",
    appId: "1:876517418051:web:01b991f208d241a65fa0f6",
    measurementId: "G-CF1LDV3QXK"
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

export { database };