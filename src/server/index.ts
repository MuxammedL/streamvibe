interface APIProps {
  page?: number;
  query: string;
}
const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const baseURL = import.meta.env.VITE_TMDB_BASE_URL;

export const movieAPI = ({ page = 1, query }: APIProps): string => {
  if (!apiKey) {
    throw new Error("API key is not defined in the environment variables");
  }

  return `${baseURL}${query}?api_key=${apiKey}&language=en-US&page=${page}`;
};

export const showsAPI = ({ page = 1, query }: APIProps): string => {
  if (!apiKey) {
    throw new Error("API key is not defined in the environment variables");
  }

  return `${baseURL}tv/${query}?api_key=${apiKey}&language=en-US&page=${page}`;
};
