import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { movieAPI, showsAPI } from '../server';

interface Genre {
    id: number;
    name: string;
}

interface Movie {
    id: number;
    backdrop_path: string | null;
    poster_path: string | null;
    overview: string | null;
    name?: string | null;
    title?: string | null;
    genre_ids?: number[];
    release_date: string;
    popularity: number;
    vote_average: number;
    vote_count: number;
}

interface Shows extends Movie {
    first_air_date: string;
}

interface DataContextProps {
    data: (Movie | Shows)[];
    movies: Movie[];
    shows: Shows[];
    genres: Genre[];
}

interface DataProviderProps {
    children: ReactNode;
}

export const DataContext = createContext<DataContextProps>({
    data: [],
    movies: [],
    shows: [],
    genres: []
});

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [shows, setShows] = useState<Shows[]>([]);
    const [data, setData] = useState<(Movie | Shows)[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);

    const getMovies = async () => {
        const totalPages = 30;
        const allMovies: Movie[] = [];

        const fetchPage = async (page: number): Promise<Movie[]> => {
            const response = await fetch(movieAPI({ page: page, query: "trending/all/day" }));
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data.results as Movie[];
        };

        try {
            for (let page = 1; page <= totalPages; page++) {
                const moviesPage = await fetchPage(page);
                allMovies.push(...moviesPage);
            }
            setMovies(allMovies);
        } catch (error) {
            console.log((error as Error).message);
        }
    };

    const getGenres = async () => {
        try {
            const response = await fetch(movieAPI({ page: 1, query: "genre/tv/list" }));
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setGenres(data.genres);

        } catch (error) {
            console.log((error as Error).message);
        }
    };

    const getShows = async () => {
        const totalPages = 30;
        const allShows: Shows[] = [];

        const fetchPage = async (page: number): Promise<Shows[]> => {
            const response = await fetch(showsAPI({ page: page, query: "popular" }));
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data.results as Shows[];
        };

        try {
            for (let page = 1; page <= totalPages; page++) {
                const showsPage = await fetchPage(page);
                allShows.push(...showsPage);
            }
            setShows(allShows);
        } catch (error) {
            console.log((error as Error).message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await getMovies();
            await getShows();
            await getGenres()
        };

        fetchData();
    }, []);

    useEffect(() => {
        setData([...movies, ...shows]);
    }, [movies, shows]);

    return (
        <DataContext.Provider value={{ data, movies, shows, genres }}>
            {children}
        </DataContext.Provider>
    );
};
