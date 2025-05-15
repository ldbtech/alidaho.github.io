import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBjaLRz-y4sH1zD36lY8XdDZSpmvo-kc0w",
  authDomain: "web-js-abf55.firebaseapp.com",
  projectId: "web-js-abf55",
  storageBucket: "web-js-abf55.firebasestorage.app",
  messagingSenderId: "477149138140",
  appId: "1:477149138140:web:11a5577a4da879a8523819",
  measurementId: "G-RDF6K9WG0R",
  databaseURL: "https://web-js-abf55-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Initialize Analytics only in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Authentication functions
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Login successful");
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error);
    throw new Error(`Login failed: ${error.message}`);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("Logout successful");
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error(`Logout failed: ${error.message}`);
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const fetchData = async (path) => {
  try {
    const dataRef = ref(database, path);
    const snapshot = await get(dataRef);
    return snapshot.val();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
};

export const saveProject = async (project) => {
  try {
    if (!auth.currentUser) {
      throw new Error("Authentication required");
    }

    if (!project.id) {
      throw new Error("Project ID is required");
    }

    const projectRef = ref(database, `projects/${project.id}`);
    console.log("Saving project to database:", project);
    await set(projectRef, project);
    console.log("Project saved successfully");
    return true;
  } catch (error) {
    console.error("Error in saveProject:", error);
    throw new Error(`Failed to save project: ${error.message}`);
  }
};

export const saveAbout = async (data) => {
  try {
    if (!auth.currentUser) {
      throw new Error("Authentication required");
    }

    const aboutRef = ref(database, "about");
    await set(aboutRef, data);
    console.log("About section saved successfully");
    return true;
  } catch (error) {
    console.error("Error in saveAbout:", error);
    throw new Error(`Failed to save about section: ${error.message}`);
  }
};

export default database; 