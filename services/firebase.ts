// Import the functions you need from the SDKs you need
import { initializeApp, setLogLevel } from "firebase/app";
import {
  addDoc,
  query,
  getDocs,
  collection,
  updateDoc,
  where,
  initializeFirestore,
  orderBy,
  limit,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
  datbaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig, "(default)");

const TRENDING_COLLECTION_NAME = "trending";
const firestore = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export const updateSearchCount = async (searchQuery: string, movie: Movie) => {
  // check if the query exists in the trending collection
  // if it does, update the count++
  // if it doesn't, add it to the collection with count 1 -> { searchTerm: query, count: 1, poster_url: movie.poster_url, title: movie.title, movie_id: movie.id }
  try {
    const trendingRef = collection(firestore, TRENDING_COLLECTION_NAME);

    const result = await getDocs(
      query(trendingRef, where("searchTerm", "==", searchQuery))
    );

    if (result.docs.length > 0) {
      const doc = result.docs[0];
      await updateDoc(doc.ref, { count: doc.data().count + 1 });
    } else {
      await addDoc(trendingRef, {
        searchTerm: searchQuery,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        title: movie.title,
        movie_id: movie.id,
      });
    }
  } catch (error) {
    console.log("Error updating search count: ", error);
    throw error;
  }
};

export const fetchTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const trendingRef = collection(firestore, TRENDING_COLLECTION_NAME);
    //get data sorted by count in descending order
    const trendingSnapshot = await getDocs(
      query(trendingRef, orderBy("count", "desc"), limit(5))
    );
    const trendingMovies = trendingSnapshot.docs.map((doc) => doc.data());

    return trendingMovies as TrendingMovie[];
  } catch (error) {
    console.log("Error fetching trending movies: ", error);
    throw error;
  }
};
