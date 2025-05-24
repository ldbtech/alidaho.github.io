import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, remove, connectDatabaseEmulator } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Fallback configuration in case environment variables are not available
const fallbackConfig = {
  apiKey: "AIzaSyBjaLRz-y4sH1zD36lY8XdDZSpmvo-kc0w",
  authDomain: "web-js-abf55.firebaseapp.com",
  databaseURL: "https://web-js-abf55-default-rtdb.firebaseio.com",
  projectId: "web-js-abf55",
  storageBucket: "web-js-abf55.firebasestorage.app",
  messagingSenderId: "477149138140",
  appId: "1:477149138140:web:11a5577a4da879a8523819"
};

// Try to use environment variables, fall back to hardcoded values if not available
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || fallbackConfig.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || fallbackConfig.databaseURL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || fallbackConfig.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || fallbackConfig.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || fallbackConfig.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || fallbackConfig.appId
};

// Initialize Firebase
let app;
let database;
let auth;

try {
  console.log('Initializing Firebase with config:', {
    ...firebaseConfig,
    apiKey: '***' // Hide API key in logs
  });
  
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  auth = getAuth(app);
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  // Provide fallback values for development
  if (process.env.NODE_ENV === 'development') {
    console.warn('Using fallback Firebase configuration');
    try {
      app = initializeApp(fallbackConfig);
      database = getDatabase(app);
      auth = getAuth(app);
      console.log('Fallback Firebase initialization successful');
    } catch (fallbackError) {
      console.error('Fallback Firebase initialization failed:', fallbackError);
    }
  }
}

// Initialize Analytics only in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.error('Error initializing Analytics:', error);
  }
}

// Auth state listener
let authStateListener = null;

export const initAuthStateListener = (callback) => {
  if (authStateListener) {
    authStateListener(); // Remove existing listener if any
  }
  
  authStateListener = onAuthStateChanged(auth, (user) => {
    callback(user);
  });

  return () => {
    if (authStateListener) {
      authStateListener();
      authStateListener = null;
    }
  };
};

// Authentication functions
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Login successful");
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error);
    let errorMessage = "Login failed";
    
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password';
        break;
      default:
        errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
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

// Profile Management Functions
export const fetchProfile = async () => {
  try {
    console.log('Fetching profile data...');
    const profileRef = ref(database, 'profile');
    const snapshot = await get(profileRef);
    const data = snapshot.val();
    console.log('Profile data received:', data);
    
    if (!data) {
      console.log('No profile data found, using default values');
      return {
        name: "Ali Dahou",
        title: "Full Stack Developer",
        bio: "I'm a passionate developer...",
        profileImage: "/images/profile-image.jpg",
        logo: "/images/logo.png",
        socialLinks: {
          github: "https://github.com/ldbtech",
          linkedin: "https://www.linkedin.com/in/alidaho/"
        }
      };
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }
};

export const saveProfile = async (profileData) => {
  try {
    if (!auth.currentUser) {
      throw new Error("Authentication required");
    }

    const profileRef = ref(database, 'profile');
    await set(profileRef, profileData);
    console.log("Profile saved successfully");
    return true;
  } catch (error) {
    console.error("Error in saveProfile:", error);
    throw new Error(`Failed to save profile: ${error.message}`);
  }
};

// Database functions with error handling
export const fetchData = async (path) => {
  try {
    console.log(`Fetching data from path: ${path}`);
    const dataRef = ref(database, path);
    const snapshot = await get(dataRef);
    const data = snapshot.val();
    console.log(`Data received from ${path}:`, data);

    if (!data) {
      console.warn(`No data found at path: ${path}`);
      if (path === 'about') {
        // Return default structure for about section
        return {
          bio: '',
          images: {
            profile: '',
            background: '',
            additional: []
          },
          skillGroups: [
            { title: 'Frontend Development', items: [] },
            { title: 'Backend Development', items: [] },
            { title: 'Database & Cloud', items: [] },
            { title: 'Tools & Others', items: [] }
          ],
          experience: [],
          education: [],
          tools: []
        };
      }
      return null;
    }

    // If data exists, ensure image URLs are properly formatted
    if (data && data.images) {
      Object.keys(data.images).forEach(key => {
        if (data.images[key] && !data.images[key].startsWith('http')) {
          data.images[key] = data.images[key].startsWith('/') 
            ? data.images[key] 
            : `/${data.images[key]}`;
        }
      });
    }

    return data;
  } catch (error) {
    console.error(`Error fetching data from ${path}:`, error);
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

// Visitor tracking functions
export const incrementVisitorCount = async () => {
  try {
    const visitorRef = ref(database, 'visitors');
    const snapshot = await get(visitorRef);
    const currentCount = snapshot.val()?.count || 0;
    
    await set(visitorRef, {
      count: currentCount + 1,
      lastUpdated: new Date().toISOString()
    });
    
    return currentCount + 1;
  } catch (error) {
    console.error("Error incrementing visitor count:", error);
    return null;
  }
};

export const getVisitorCount = async () => {
  try {
    const visitorRef = ref(database, 'visitors');
    const snapshot = await get(visitorRef);
    return snapshot.val()?.count || 0;
  } catch (error) {
    console.error("Error getting visitor count:", error);
    return 0;
  }
};

export const getProjectCount = async () => {
  try {
    const projectsRef = ref(database, 'projects');
    const snapshot = await get(projectsRef);
    const projects = snapshot.val();
    return projects ? Object.keys(projects).length : 0;
  } catch (error) {
    console.error("Error getting project count:", error);
    return 0;
  }
};

// Export the database instance
export { database };

// Add thoughts-related functions
export const saveThought = async (thought) => {
  try {
    const thoughtRef = ref(database, `thoughts/${thought.id}`);
    await set(thoughtRef, thought);
    return true;
  } catch (error) {
    console.error('Error saving thought:', error);
    throw error;
  }
};

export const deleteThought = async (thoughtId) => {
  try {
    const thoughtRef = ref(database, `thoughts/${thoughtId}`);
    await remove(thoughtRef);
    return true;
  } catch (error) {
    console.error('Error deleting thought:', error);
    throw error;
  }
};

export default database; 