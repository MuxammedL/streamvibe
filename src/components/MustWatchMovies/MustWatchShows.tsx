import { useState, useEffect, useRef } from 'react'
import CustomPagination from '../SwiperPagination/SwiperPagination';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectFade } from 'swiper/modules';
import SwiperCore from 'swiper';
import styles from "./MustWatchMovies.module.scss"
import { showsAPI } from '../../server';
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

const MustWatchShows = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef<SwiperCore | null>(null);
    const [shows, setShows] = useState<Movie[]>([])
    const [error, setError] = useState<string | null>(null);
    const [interval, setInterval] = useState<number>(4)


    const handleBulletClick = (index: number) => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(index);
        }
    };

    const handleResize = (): void => {
        if (window.innerWidth > 1100) {
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
        const fetchShows = async () => {
            try {
                const response = await fetch(showsAPI({ page: 1, query: "top_rated" }));
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const { results } = data;
                const sortedShows = results.sort((a: Movie, b: Movie) => b.vote_count - a.vote_count);
                setShows(sortedShows);
            } catch (error) {
                setError((error as Error).message);
            }
        };

        fetchShows();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <section className='trending-now'>
            <div className="heading">
                <h2>Must - Watch Shows</h2>
                <div className="controller-pagination">
                    <button className={`sm-prev-slide btn-dark pBtn`}>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.75 14L5.25 14M5.25 14L13.125 21.875M5.25 14L13.125 6.125" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <CustomPagination totalSlides={4}
                        activeIndex={activeIndex}
                        onBulletClick={handleBulletClick} />
                    <button className={`sm-next-slide btn-dark pBtn`}>
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
                    nextEl: ".sm-next-slide",
                    prevEl: ".sm-prev-slide",
                }}
                autoplay={{
                    delay: 13000,
                    disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
                loop={true}
                modules={[EffectFade, Autoplay, Navigation]}
                className="MustWatchShows"
            >
                <SwiperSlide className={styles.slide}>
                    {
                        shows && shows.slice(0, interval).map((movie, index) => (
                            <div className={styles.movie} key={`${movie.id}${index}`}>
                                <div className={styles.image}>
                                    <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} />
                                </div>
                                <div className={styles["movie-bottom"]}>
                                    <div className={styles.detail}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M10 1.875C5.51269 1.875 1.875 5.51269 1.875 10C1.875 14.4873 5.51269 18.125 10 18.125C14.4873 18.125 18.125 14.4873 18.125 10C18.125 5.51269 14.4873 1.875 10 1.875ZM10.625 5C10.625 4.65482 10.3452 4.375 10 4.375C9.65482 4.375 9.375 4.65482 9.375 5V10C9.375 10.3452 9.65482 10.625 10 10.625H13.75C14.0952 10.625 14.375 10.3452 14.375 10C14.375 9.65482 14.0952 9.375 13.75 9.375H10.625V5Z" fill="currentColor" />
                                        </svg>
                                        1h 57min
                                    </div>
                                    <div className={styles.detail}>
                                        <div className={styles.stars}>
                                            {Array.from({ length: 5 }).map((_, index) => {
                                                if (Math.ceil(movie.vote_average / 2) > index) {
                                                    return (
                                                        <svg key={`${movie.id}${index}`} xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                                                            <path d="M9 0L12.1158 4.7114L17.5595 6.21885L14.0416 10.6381L14.2901 16.2812L9 14.301L3.70993 16.2812L3.95845 10.6381L0.440492 6.21885L5.88415 4.7114L9 0Z" fill="#e50000" />
                                                        </svg>
                                                    )
                                                }
                                                return (
                                                    <svg key={`${movie.id}${index}`} xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                                                        <path d="M9 0L12.1158 4.7114L17.5595 6.21885L14.0416 10.6381L14.2901 16.2812L9 14.301L3.70993 16.2812L3.95845 10.6381L0.440492 6.21885L5.88415 4.7114L9 0Z" fill="#999" />
                                                    </svg>
                                                );
                                            })}
                                        </div>
                                        {(movie.vote_count / 1000).toFixed(1) + 'K'}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </SwiperSlide>
                <SwiperSlide className={styles.slide}>
                    {
                        shows && shows.slice(interval, interval * 2).map((movie, index) => (
                            <div className={styles.movie} key={`${movie.id}${index}`}>
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
                                        <div className={styles.stars}>
                                            {Array.from({ length: 5 }).map((_, index) => {
                                                if (Math.ceil(movie.vote_average / 2) > index) {
                                                    return (
                                                        <svg key={`${movie.id}${index}`} xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                                                            <path d="M9 0L12.1158 4.7114L17.5595 6.21885L14.0416 10.6381L14.2901 16.2812L9 14.301L3.70993 16.2812L3.95845 10.6381L0.440492 6.21885L5.88415 4.7114L9 0Z" fill="#e50000" />
                                                        </svg>
                                                    )
                                                }
                                                return (
                                                    <svg key={`${movie.id}${index}`} xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                                                        <path d="M9 0L12.1158 4.7114L17.5595 6.21885L14.0416 10.6381L14.2901 16.2812L9 14.301L3.70993 16.2812L3.95845 10.6381L0.440492 6.21885L5.88415 4.7114L9 0Z" fill="#999" />
                                                    </svg>
                                                );
                                            })}
                                        </div>
                                        {(movie.vote_count / 1000).toFixed(1) + 'K'}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </SwiperSlide>
                <SwiperSlide className={styles.slide}>
                    {
                        shows && shows.slice(interval * 2, interval * 3).map((movie, index) => (
                            <div className={styles.movie} key={`${movie.id}${index}`}>
                                <div className={styles.image}>
                                    <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} />
                                </div>
                                <div className={styles["movie-bottom"]}>
                                    <div className={styles.detail}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M10 1.875C5.51269 1.875 1.875 5.51269 1.875 10C1.875 14.4873 5.51269 18.125 10 18.125C14.4873 18.125 18.125 14.4873 18.125 10C18.125 5.51269 14.4873 1.875 10 1.875ZM10.625 5C10.625 4.65482 10.3452 4.375 10 4.375C9.65482 4.375 9.375 4.65482 9.375 5V10C9.375 10.3452 9.65482 10.625 10 10.625H13.75C14.0952 10.625 14.375 10.3452 14.375 10C14.375 9.65482 14.0952 9.375 13.75 9.375H10.625V5Z" fill="currentColor" />
                                        </svg>
                                        1h 43min
                                    </div>
                                    <div className={styles.detail}>
                                        <div className={styles.stars}>

                                            {Array.from({ length: 5 }).map((_, index) => {
                                                if (Math.floor(movie.vote_average / 2) > index) {
                                                    return (
                                                        <svg key={`${movie.id}${index}`} xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                                                            <path d="M9 0L12.1158 4.7114L17.5595 6.21885L14.0416 10.6381L14.2901 16.2812L9 14.301L3.70993 16.2812L3.95845 10.6381L0.440492 6.21885L5.88415 4.7114L9 0Z" fill="#e50000" />
                                                        </svg>
                                                    )
                                                }
                                                return (
                                                    <svg key={`${movie.id}${index}`} xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                                                        <path d="M9 0L12.1158 4.7114L17.5595 6.21885L14.0416 10.6381L14.2901 16.2812L9 14.301L3.70993 16.2812L3.95845 10.6381L0.440492 6.21885L5.88415 4.7114L9 0Z" fill="#999" />
                                                    </svg>
                                                );
                                            })}
                                        </div>
                                        {(movie.vote_count / 1000).toFixed(1) + 'K'}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </SwiperSlide>
                <SwiperSlide className={styles.slide}>
                    {
                        shows && shows.slice(interval * 3, interval * 4).map((movie, index) => (
                            <div className={styles.movie} key={`${movie.id}${index}`}>
                                <div className={styles.image}>
                                    <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} />
                                </div>
                                <div className={styles["movie-bottom"]}>
                                    <div className={styles.detail}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M10 1.875C5.51269 1.875 1.875 5.51269 1.875 10C1.875 14.4873 5.51269 18.125 10 18.125C14.4873 18.125 18.125 14.4873 18.125 10C18.125 5.51269 14.4873 1.875 10 1.875ZM10.625 5C10.625 4.65482 10.3452 4.375 10 4.375C9.65482 4.375 9.375 4.65482 9.375 5V10C9.375 10.3452 9.65482 10.625 10 10.625H13.75C14.0952 10.625 14.375 10.3452 14.375 10C14.375 9.65482 14.0952 9.375 13.75 9.375H10.625V5Z" fill="currentColor" />
                                        </svg>
                                        1h 55min
                                    </div>
                                    <div className={styles.detail}>
                                        <div className={styles.stars}>
                                            {Array.from({ length: 5 }).map((_, index) => {
                                                if (Math.floor(movie.vote_average / 2) > index) {
                                                    return (
                                                        <svg key={`${movie.id}${index}`} xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                                                            <path d="M9 0L12.1158 4.7114L17.5595 6.21885L14.0416 10.6381L14.2901 16.2812L9 14.301L3.70993 16.2812L3.95845 10.6381L0.440492 6.21885L5.88415 4.7114L9 0Z" fill="#e50000" />
                                                        </svg>
                                                    )
                                                }
                                                return (
                                                    <svg key={`${movie.id}${index}`} xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                                                        <path d="M9 0L12.1158 4.7114L17.5595 6.21885L14.0416 10.6381L14.2901 16.2812L9 14.301L3.70993 16.2812L3.95845 10.6381L0.440492 6.21885L5.88415 4.7114L9 0Z" fill="#999" />
                                                    </svg>
                                                );
                                            })}


                                        </div>
                                        {(movie.vote_count / 1000).toFixed(1) + 'K'}
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

export default MustWatchShows