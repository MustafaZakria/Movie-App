export const TMDB_CONFIG = {
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  BASE_URL: "https://api.themoviedb.org/3",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

export const fetchMovies = async ({ query }: { query?: string }) => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    console.error(response.status);
    throw new Error(`Failed to fetch movies: ${response.status}`);
  }

  const data = await response.json();
  return data.results;
};

export const fetchMovieDetails = async (id: string): Promise<MovieDetails> => {
  try {
    const endpoint = `${TMDB_CONFIG.BASE_URL}/movie/${id}?api_key=${TMDB_CONFIG.API_KEY}`;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
      console.error(response.status);
      throw new Error(`Failed to fetch movie details: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching movie details: ", error);
    throw error;
  }
};
