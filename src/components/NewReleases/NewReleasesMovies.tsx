import { useState, useEffect, useRef } from 'react'
import CustomPagination from '../SwiperPagination/SwiperPagination';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectFade } from 'swiper/modules';
import SwiperCore from 'swiper';
import styles from "./NewReleases.module.scss"
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

const NewReleasesMovies = () => {
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
                const response = await fetch(movieAPI({ page: 1, query: "movie/upcoming" }));
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
                <h2>New Releases</h2>
                <div className="controller-pagination">
                    <button className={`n-prev-slide btn-dark pBtn`}>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.75 14L5.25 14M5.25 14L13.125 21.875M5.25 14L13.125 6.125" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <CustomPagination totalSlides={4}
                        activeIndex={activeIndex}
                        onBulletClick={handleBulletClick} />
                    <button className={`n-next-slide btn-dark pBtn`}>
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
                    nextEl: ".n-next-slide",
                    prevEl: ".n-prev-slide",
                }}
                autoplay={{
                    delay: 7000,
                    disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
                loop={true}
                modules={[EffectFade, Autoplay, Navigation]}
                className="NewReleases"
            >
                <SwiperSlide className={styles.slide}>
                    {
                        movies && movies.slice(0, interval).map((movie, index) => (
                            <div className={styles.movie} key={index}>
                                <div className={styles.image}>
                                    <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} />
                                </div>
                                <div className={styles["movie-bottom"]}>
                                    <div className={styles.detail}>
                                        Release at <span>{movie.release_date}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </SwiperSlide>
                <SwiperSlide className={styles.slide}>
                    {
                        movies && movies.slice(interval, interval * 2).map((movie, index) => (
                            <div className={styles.movie} key={index}>
                                <div className={styles.image}>
                                    <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} />
                                </div>
                                <div className={styles["movie-bottom"]}>
                                    <div className={styles.detail}>
                                        Release at <span>{movie.release_date}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </SwiperSlide>
                <SwiperSlide className={styles.slide}>
                    {
                        movies && movies.slice(interval * 2, interval * 3).map((movie, index) => (
                            <div className={styles.movie} key={index}>
                                <div className={styles.image}>
                                    <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} />
                                </div>
                                <div className={styles["movie-bottom"]}>
                                    <div className={styles.detail}>
                                        Release at <span>{movie.release_date}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </SwiperSlide>
                <SwiperSlide className={styles.slide}>
                    {
                        movies && movies.slice(interval * 3, interval * 4).map((movie, index) => (
                            <div className={styles.movie} key={index}>
                                <div className={styles.image}>
                                    <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} />
                                </div>
                                <div className={styles["movie-bottom"]}>
                                    <div className={styles.detail}>
                                        Release at <span>{movie.release_date}</span>
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

export default NewReleasesMovies