import { get, ref } from 'firebase/database';
import { database } from '../../services/firebase';
import Link from 'next/link';
import { FaArrowLeft, FaCalendarAlt, FaTag } from 'react-icons/fa';
import ThoughtClient from './ThoughtClient';

// Generate static params for static export
export async function generateStaticParams() {
  try {
    if (!database) {
      console.warn('Firebase database not initialized, returning empty params');
      return [];
    }

    const thoughtsRef = ref(database, 'thoughts');
    const snapshot = await get(thoughtsRef);
    const thoughts = snapshot.val();

    if (!thoughts) {
      console.warn('No thoughts found, returning empty params');
      return [];
    }

    // Return array of params for each thought
    return Object.keys(thoughts).map((id) => ({
      id: id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Server component that fetches data at build time
const ThoughtPage = async ({ params }) => {
  let thought = null;
  let error = null;

  try {
    if (!database) {
      throw new Error('Firebase database not initialized');
    }

    console.log('Fetching thought with ID:', params.id);
    const thoughtRef = ref(database, `thoughts/${params.id}`);
    const snapshot = await get(thoughtRef);
    const data = snapshot.val();
    
    if (data) {
      thought = data;
    } else {
      error = 'Thought not found';
    }
  } catch (err) {
    console.error('Error fetching thought:', err);
    error = 'Error loading thought';
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{error}</h1>
          <Link href="/thoughts" className="text-blue-500 hover:text-blue-600">
            Return to Thoughts
          </Link>
        </div>
      </div>
    );
  }

  if (!thought) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Thought not found</h1>
          <Link href="/thoughts" className="text-blue-500 hover:text-blue-600">
            Return to Thoughts
          </Link>
        </div>
      </div>
    );
  }

  return <ThoughtClient thought={thought} />;
};

export default ThoughtPage; 