import React, { useState, useEffect, useRef, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectFade } from 'swiper/modules';
import styles from "./PopularTopGenres.module.scss"
import SwiperCore from 'swiper';
import CustomPagination from "../SwiperPagination/SwiperPagination";
import { DataContext } from "../../context/DataContext";

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

interface Props {
    movies: Movie[];
}

const PopularTopGenresMovies: React.FC<Props> = ({ movies }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef<SwiperCore | null>(null);
    const { genres } = useContext(DataContext);
    
    const [interval, setInterval] = useState<number>(5)
    const [mobileDesign, setMobileDesign] = useState<boolean>(false)
    const [sortedMovies, setSortedMovies] = useState<Movie[]>(movies)
    const handleBulletClick = (index: number) => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(index);
        }
    };

    const handleResize = (): void => {
        if (window.innerWidth > 1024) {
            setInterval(4)
            setMobileDesign(false)
        } else if (window.innerWidth > 768) {
            setInterval(3)
            setMobileDesign(false)
        } else if (window.innerWidth > 480) {
            setInterval(2)
            setMobileDesign(true)
        } else {
            setInterval(1)
        }
    }

    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.on('slideChange', () => {
                setActiveIndex(swiperRef.current!.realIndex);
            });
        }

    }, []);

    useEffect(() => {
        setSortedMovies(movies.sort((a: Movie, b: Movie) => b.vote_count - a.vote_count));
    }, [movies])

    useEffect(() => {
        handleResize()
        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

   
    return (
        sortedMovies && genres && (
            <section className={styles['our-genres']}>
                <div className="heading">
                    <h2>Popular Top 10 In Genres</h2>
                    <div className="controller-pagination">
                        <button className={`p-prev-slide btn-dark pBtn`}>
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.75 14L5.25 14M5.25 14L13.125 21.875M5.25 14L13.125 6.125" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <CustomPagination totalSlides={(genres.length) / 4}
                            activeIndex={activeIndex}
                            onBulletClick={handleBulletClick} />
                        <button className={`p-next-slide btn-dark pBtn`}>
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.75 5.25L24.5 14M24.5 14L15.75 22.75M24.5 14H3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className={styles["slider"]}>
                    {!mobileDesign && (
                        <Swiper
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                            }}
                            navigation={{
                                nextEl: ".p-next-slide",
                                prevEl: ".p-prev-slide",
                            }}
                            pagination={{ clickable: true }}
                            loop={true}
                            modules={[EffectFade, Autoplay, Navigation]}
                            className="PopularTopGenresMovies"
                        >
                            <SwiperSlide>
                                <div className={styles.slide}>
                                    {genres.slice(0, interval).map((item) => (
                                        <div key={item.id} className={styles["genre"]}>
                                            <div className={styles.images}>
                                                {sortedMovies && sortedMovies
                                                    .filter(movie => movie.genre_ids?.includes(item.id)).slice(0, 4)
                                                    .map((filteredMovie, index) => (
                                                        <img key={`${filteredMovie.id}${index}`}
                                                            src={`https://image.tmdb.org/t/p/original/${filteredMovie.poster_path}`}
                                                            alt={`${filteredMovie.title || filteredMovie.name} Poster`}
                                                        />

                                                    ))}
                                            </div>
                                            <div className={styles["genre-title"]}>
                                                <div className={styles.group}>
                                                    <div className={`btn-primary ${styles.btn}`}>
                                                        Top 10 in
                                                    </div>
                                                    <p>{item.name}</p>
                                                </div>
                                                <div className={styles.icon}>
                                                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M15.75 5.25L24.5 14M24.5 14L15.75 22.75M24.5 14H3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className={styles.slide}>
                                    {genres.slice(interval, 2 * interval).map((item) => (
                                        <div key={item.id} className={styles["genre"]}>
                                            <div className={styles.images}>
                                                {sortedMovies && sortedMovies
                                                    .filter(movie => movie.genre_ids?.includes(item.id)).slice(0, 4)
                                                    .map((filteredMovie, index) => (
                                                        <img key={`${filteredMovie.id}${index}`}
                                                            src={`https://image.tmdb.org/t/p/original/${filteredMovie.poster_path}`}
                                                            alt={`${filteredMovie.title || filteredMovie.name} Poster`}
                                                        />

                                                    ))}
                                            </div>
                                            <div className={styles["genre-title"]}>
                                                <div className={styles.group}>
                                                    <div className={`btn-primary ${styles.btn}`}>
                                                        Top 10 in
                                                    </div>
                                                    <p>{item.name}</p>
                                                </div>
                                                <div className={styles.icon}>
                                                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M15.75 5.25L24.5 14M24.5 14L15.75 22.75M24.5 14H3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className={styles.slide}>
                                    {genres.slice(2 * interval, 3 * interval).map((item) => (
                                        <div key={item.id} className={styles["genre"]}>
                                            <div className={styles.images}>
                                                {sortedMovies && sortedMovies
                                                    .filter(movie => movie.genre_ids?.includes(item.id)).slice(0, 4)
                                                    .map((filteredMovie, index) => (
                                                        <img key={`${filteredMovie.id}${index}`}
                                                            src={`https://image.tmdb.org/t/p/original/${filteredMovie.poster_path}`}
                                                            alt={`${filteredMovie.title || filteredMovie.name} Poster`}
                                                        />

                                                    ))}
                                            </div>
                                            <div className={styles["genre-title"]}>
                                                <div className={styles.group}>
                                                    <div className={`btn-primary ${styles.btn}`}>
                                                        Top 10 in
                                                    </div>
                                                    <p>{item.name}</p>
                                                </div>
                                                <div className={styles.icon}>
                                                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M15.75 5.25L24.5 14M24.5 14L15.75 22.75M24.5 14H3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className={styles.slide}>
                                    {genres.slice(3 * interval, 4 * interval).map((item) => (
                                        <div key={item.id} className={styles["genre"]}>
                                            <div className={styles.images}>
                                                {sortedMovies && sortedMovies
                                                    .filter(movie => movie.genre_ids?.includes(item.id)).slice(0, 4)
                                                    .map(filteredMovie => (
                                                        <img key={filteredMovie.id}
                                                            src={`https://image.tmdb.org/t/p/original/${filteredMovie.poster_path}`}
                                                            alt={`${filteredMovie.title || filteredMovie.name} Poster`}
                                                        />

                                                    ))}
                                            </div>
                                            <div className={styles["genre-title"]}>
                                                <div className={styles.group}>
                                                    <div className={`btn-primary ${styles.btn}`}>
                                                        Top 10 in
                                                    </div>
                                                    <p>{item.name}</p>
                                                </div>
                                                <div className={styles.icon}>
                                                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M15.75 5.25L24.5 14M24.5 14L15.75 22.75M24.5 14H3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </SwiperSlide>
                        </Swiper>
                    )}

                    {mobileDesign && (
                        <Swiper
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                            }}
                            pagination={{ clickable: true }}
                            slidesPerView={interval}
                            spaceBetween={16}
                            loop={true}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                            }}
                            modules={[EffectFade, Autoplay, Navigation]}
                            className="PopularTopGenresMovies"
                        >
                            {genres.map((item) => (
                                <SwiperSlide key={item.id} >
                                    <div className={styles["genre"]}>
                                        <div className={styles.images}>
                                            {sortedMovies && sortedMovies
                                                .filter(movie => movie.genre_ids?.includes(item.id)).slice(0, 4)
                                                .map((filteredMovie, index) => (
                                                    <img key={`${filteredMovie.id}${index}`}
                                                        src={`https://image.tmdb.org/t/p/original/${filteredMovie.poster_path}`}
                                                        alt={`${filteredMovie.title || filteredMovie.name} Poster`}
                                                    />

                                                ))}
                                        </div>
                                        <div className={styles["genre-title"]}>
                                            <div className={styles.group}>
                                                <div className={`btn-primary ${styles.btn}`}>
                                                    Top 10 in
                                                </div>
                                                <p>{item.name}</p>
                                            </div>
                                            <div className={styles.icon}>
                                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M15.75 5.25L24.5 14M24.5 14L15.75 22.75M24.5 14H3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
            </section>
        )
    )
}

export default PopularTopGenresMovies