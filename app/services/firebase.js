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

// Profile Management Functions
export const fetchProfile = async () => {
  try {
    const profileRef = ref(database, 'profile');
    const snapshot = await get(profileRef);
    return snapshot.val() || {
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

// Existing functions
export const fetchData = async (path) => {
  try {
    const dataRef = ref(database, path);
    const snapshot = await get(dataRef);
    const data = snapshot.val();

    if (path === 'about' && !data) {
      // Return default structure for about section
      return {
        bio: '',
        images: {
          profile: '',  // Empty string for no image
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

    // If data exists, ensure image URLs are properly formatted
    if (data && data.images) {
      // Ensure all image URLs are absolute
      Object.keys(data.images).forEach(key => {
        if (data.images[key] && !data.images[key].startsWith('http')) {
          // If it's not already an absolute URL, make it one
          data.images[key] = data.images[key].startsWith('/') 
            ? data.images[key] 
            : `/${data.images[key]}`;
        }
      });
    }

    return data;
  } catch (error) {
    console.error(`Error fetching data from ${path}:`, error);
    throw new Error(`Failed to fetch data from ${path}: ${error.message}`);
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

export const saveJourneyEvent = async (event) => {
  try {
    if (!auth.currentUser) {
      throw new Error("Authentication required");
    }

    if (!event.id) {
      throw new Error("Event ID is required");
    }

    const eventRef = ref(database, `journey/${event.id}`);
    await set(eventRef, event);
    console.log("Journey event saved successfully");
    return true;
  } catch (error) {
    console.error("Error saving journey event:", error);
    throw new Error(`Failed to save journey event: ${error.message}`);
  }
};

export default database; 