import { useState, useEffect, useRef } from 'react'
import CustomPagination from '../SwiperPagination/SwiperPagination';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectFade } from 'swiper/modules';
import SwiperCore from 'swiper';
import styles from "./TrendingNow.module.scss"
import { movieAPI } from '../../server';
SwiperCore.use([Navigation, EffectFade, Autoplay]);


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

const TrendingNowMovies = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef<SwiperCore | null>(null);
    const [movies, setMovies] = useState<Movie[]>([])
    const [error, setError] = useState<string | null>(null);
    const [interval, setInterval] = useState<number>(5)

    const handleBulletClick = (index: number) => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(index);
        }
    };

    const handleResize = (): void => {
        if (window.innerWidth > 1280) {
            setInterval(5)
        } else if (window.innerWidth > 1040) {
            setInterval(4)
        } else if (window.innerWidth > 820) {
            setInterval(3)
        } else if (window.innerWidth > 480) {
            setInterval(2)
        } else {
            setInterval(1)
        }
    }

    useEffect(() => {
        handleResize()
        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.on('slideChange', () => {
                setActiveIndex(swiperRef.current!.realIndex);
            });
        }
        const fetchMovies = async () => {
            try {
                const response = await fetch(movieAPI({ page: 1, query: "movie/popular" }));
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const { results } = data;
                setMovies(results);
            } catch (error) {
                setError((error as Error).message);
            }
        };

        fetchMovies();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <section className='trending-now'>
            <div className="heading">
                <h2>Trending Now</h2>
                <div className="controller-pagination">
                    <button className={`t-prev-slide btn-dark pBtn`}>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.75 14L5.25 14M5.25 14L13.125 21.875M5.25 14L13.125 6.125" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <CustomPagination totalSlides={4}
                        activeIndex={activeIndex}
                        onBulletClick={handleBulletClick} />
                    <button className={`t-next-slide btn-dark pBtn`}>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.75 5.25L24.5 14M24.5 14L15.75 22.75M24.5 14H3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
            <Swiper
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                navigation={{
                    nextEl: ".t-next-slide",
                    prevEl: ".t-prev-slide",
                }}
                autoplay={{
                    delay: 10000,
                    disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
                loop={true}
                modules={[EffectFade, Autoplay, Navigation]}
                className="trendingNowMovies"
            >
                <SwiperSlide className={styles.slide}>
                    {
                        movies && movies.slice(0, interval).map((movie, index) => (
                            <div className={styles.movie} key={`${movie.id}5${index}`}>
                                <div className={styles.image}>
                                    <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} />
                                </div>
                                <div className={styles["movie-bottom"]}>
                                    <div className={styles.detail}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M10 1.875C5.51269 1.875 1.875 5.51269 1.875 10C1.875 14.4873 5.51269 18.125 10 18.125C14.4873 18.125 18.125 14.4873 18.125 10C18.125 5.51269 14.4873 1.875 10 1.875ZM10.625 5C10.625 4.65482 10.3452 4.375 10 4.375C9.65482 4.375 9.375 4.65482 9.375 5V10C9.375 10.3452 9.65482 10.625 10 10.625H13.75C14.0952 10.625 14.375 10.3452 14.375 10C14.375 9.65482 14.0952 9.375 13.75 9.375H10.625V5Z" fill="currentColor" />
                                        </svg>
                                        1h 30min
                                    </div>
                                    <div className={styles.detail}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M9.99951 12.5C11.3802 12.5 12.4995 11.3807 12.4995 10C12.4995 8.61929 11.3802 7.5 9.99951 7.5C8.6188 7.5 7.49951 8.61929 7.49951 10C7.49951 11.3807 8.6188 12.5 9.99951 12.5Z" fill="currentColor" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M1.10235 9.53891C2.34173 5.81309 5.85611 3.125 9.99994 3.125C14.1419 3.125 17.6549 5.8106 18.8958 9.53371C18.9961 9.8346 18.9962 10.1601 18.8961 10.4611C17.6567 14.1869 14.1423 16.875 9.99848 16.875C5.85657 16.875 2.34354 14.1894 1.10263 10.4663C1.00234 10.1654 1.00225 9.83986 1.10235 9.53891ZM14.3745 10C14.3745 12.4162 12.4158 14.375 9.99951 14.375C7.58327 14.375 5.62451 12.4162 5.62451 10C5.62451 7.58375 7.58327 5.625 9.99951 5.625C12.4158 5.625 14.3745 7.58375 14.3745 10Z" fill="currentColor" />
                                        </svg>
                                        {(movie.popularity / 1000).toFixed(1) + 'K'}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </SwiperSlide>
                <SwiperSlide className={styles.slide}>
                    {
                        movies && movies.slice(interval, interval * 2).map((movie, index) => (
                            <div className={styles.movie} key={`${movie.id}15${index}`}>
                                <div className={styles.image}>
                                    <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} />
                                </div>
                                <div className={styles["movie-bottom"]}>
                                    <div className={styles.detail}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M10 1.875C5.51269 1.875 1.875 5.51269 1.875 10C1.875 14.4873 5.51269 18.125 10 18.125C14.4873 18.125 18.125 14.4873 18.125 10C18.125 5.51269 14.4873 1.875 10 1.875ZM10.625 5C10.625 4.65482 10.3452 4.375 10 4.375C9.65482 4.375 9.375 4.65482 9.375 5V10C9.375 10.3452 9.65482 10.625 10 10.625H13.75C14.0952 10.625 14.375 10.3452 14.375 10C14.375 9.65482 14.0952 9.375 13.75 9.375H10.625V5Z" fill="currentColor" />
                                        </svg>
                                        1h 30min
                                    </div>
                                    <div className={styles.detail}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M9.99951 12.5C11.3802 12.5 12.4995 11.3807 12.4995 10C12.4995 8.61929 11.3802 7.5 9.99951 7.5C8.6188 7.5 7.49951 8.61929 7.49951 10C7.49951 11.3807 8.6188 12.5 9.99951 12.5Z" fill="currentColor" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M1.10235 9.53891C2.34173 5.81309 5.85611 3.125 9.99994 3.125C14.1419 3.125 17.6549 5.8106 18.8958 9.53371C18.9961 9.8346 18.9962 10.1601 18.8961 10.4611C17.6567 14.1869 14.1423 16.875 9.99848 16.875C5.85657 16.875 2.34354 14.1894 1.10263 10.4663C1.00234 10.1654 1.00225 9.83986 1.10235 9.53891ZM14.3745 10C14.3745 12.4162 12.4158 14.375 9.99951 14.375C7.58327 14.375 5.62451 12.4162 5.62451 10C5.62451 7.58375 7.58327 5.625 9.99951 5.625C12.4158 5.625 14.3745 7.58375 14.3745 10Z" fill="currentColor" />
                                        </svg>
                                        {(movie.popularity / 1000).toFixed(1) + 'K'}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </SwiperSlide>
                <SwiperSlide className={styles.slide}>
                    {
                        movies && movies.slice(interval * 2, interval * 3).map((movie, index) => (
                            <div className={styles.movie} key={`${movie.id}41${index}`}>
                                <div className={styles.image}>
                                    <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} />
                                </div>
                                <div className={styles["movie-bottom"]}>
                                    <div className={styles.detail}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M10 1.875C5.51269 1.875 1.875 5.51269 1.875 10C1.875 14.4873 5.51269 18.125 10 18.125C14.4873 18.125 18.125 14.4873 18.125 10C18.125 5.51269 14.4873 1.875 10 1.875ZM10.625 5C10.625 4.65482 10.3452 4.375 10 4.375C9.65482 4.375 9.375 4.65482 9.375 5V10C9.375 10.3452 9.65482 10.625 10 10.625H13.75C14.0952 10.625 14.375 10.3452 14.375 10C14.375 9.65482 14.0952 9.375 13.75 9.375H10.625V5Z" fill="currentColor" />
                                        </svg>
                                        1h 30min
                                    </div>
                                    <div className={styles.detail}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M9.99951 12.5C11.3802 12.5 12.4995 11.3807 12.4995 10C12.4995 8.61929 11.3802 7.5 9.99951 7.5C8.6188 7.5 7.49951 8.61929 7.49951 10C7.49951 11.3807 8.6188 12.5 9.99951 12.5Z" fill="currentColor" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M1.10235 9.53891C2.34173 5.81309 5.85611 3.125 9.99994 3.125C14.1419 3.125 17.6549 5.8106 18.8958 9.53371C18.9961 9.8346 18.9962 10.1601 18.8961 10.4611C17.6567 14.1869 14.1423 16.875 9.99848 16.875C5.85657 16.875 2.34354 14.1894 1.10263 10.4663C1.00234 10.1654 1.00225 9.83986 1.10235 9.53891ZM14.3745 10C14.3745 12.4162 12.4158 14.375 9.99951 14.375C7.58327 14.375 5.62451 12.4162 5.62451 10C5.62451 7.58375 7.58327 5.625 9.99951 5.625C12.4158 5.625 14.3745 7.58375 14.3745 10Z" fill="currentColor" />
                                        </svg>
                                        {(movie.popularity / 1000).toFixed(1) + 'K'}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </SwiperSlide>
                <SwiperSlide className={styles.slide}>
                    {
                        movies && movies.slice(interval * 3, interval * 4).map((movie, index) => (
                            <div className={styles.movie} key={`${movie.id}48${index}`}>
                                <div className={styles.image}>
                                    <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} />
                                </div>
                                <div className={styles["movie-bottom"]}>
                                    <div className={styles.detail}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M10 1.875C5.51269 1.875 1.875 5.51269 1.875 10C1.875 14.4873 5.51269 18.125 10 18.125C14.4873 18.125 18.125 14.4873 18.125 10C18.125 5.51269 14.4873 1.875 10 1.875ZM10.625 5C10.625 4.65482 10.3452 4.375 10 4.375C9.65482 4.375 9.375 4.65482 9.375 5V10C9.375 10.3452 9.65482 10.625 10 10.625H13.75C14.0952 10.625 14.375 10.3452 14.375 10C14.375 9.65482 14.0952 9.375 13.75 9.375H10.625V5Z" fill="currentColor" />
                                        </svg>
                                        1h 30min
                                    </div>
                                    <div className={styles.detail}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M9.99951 12.5C11.3802 12.5 12.4995 11.3807 12.4995 10C12.4995 8.61929 11.3802 7.5 9.99951 7.5C8.6188 7.5 7.49951 8.61929 7.49951 10C7.49951 11.3807 8.6188 12.5 9.99951 12.5Z" fill="currentColor" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M1.10235 9.53891C2.34173 5.81309 5.85611 3.125 9.99994 3.125C14.1419 3.125 17.6549 5.8106 18.8958 9.53371C18.9961 9.8346 18.9962 10.1601 18.8961 10.4611C17.6567 14.1869 14.1423 16.875 9.99848 16.875C5.85657 16.875 2.34354 14.1894 1.10263 10.4663C1.00234 10.1654 1.00225 9.83986 1.10235 9.53891ZM14.3745 10C14.3745 12.4162 12.4158 14.375 9.99951 14.375C7.58327 14.375 5.62451 12.4162 5.62451 10C5.62451 7.58375 7.58327 5.625 9.99951 5.625C12.4158 5.625 14.3745 7.58375 14.3745 10Z" fill="currentColor" />
                                        </svg>
                                        {(movie.popularity / 1000).toFixed(1) + 'K'}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </SwiperSlide>


            </Swiper>
        </section>
    )
}

export default TrendingNowMovies