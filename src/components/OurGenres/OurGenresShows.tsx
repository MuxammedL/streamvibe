import React, { useState, useEffect, useRef, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectFade } from 'swiper/modules';
import styles from "./ourGenres.module.scss"
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
interface Shows extends Movie {
    first_air_date: string;
}

interface Props {
    shows: Shows[];
}

const OurGenresShows: React.FC<Props> = ({ shows }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef<SwiperCore | null>(null);
    const { genres } = useContext(DataContext);
    const [interval, setInterval] = useState<number>(5)
    const [mobileDesign, setMobileDesign] = useState<boolean>(false)

    const handleBulletClick = (index: number) => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(index);
        }
    };

    const handleResize = (): void => {
        if (window.innerWidth > 1200) {
            setInterval(5)
            setMobileDesign(false)
        } else if (window.innerWidth > 1024) {
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
        handleResize()
        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);


    return (
        shows && genres && (
            <section className={styles['our-genres']}>
                <div className="heading">
                    <h2>Our Genres</h2>
                    <div className="controller-pagination">
                        <button className={`sg-prev-slide btn-dark pBtn`}>
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.75 14L5.25 14M5.25 14L13.125 21.875M5.25 14L13.125 6.125" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <CustomPagination totalSlides={(genres.length) / 4}
                            activeIndex={activeIndex}
                            onBulletClick={handleBulletClick} />
                        <button className={`sg-next-slide btn-dark pBtn`}>
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
                                nextEl: ".sg-next-slide",
                                prevEl: ".sg-prev-slide",
                            }}
                            pagination={{ clickable: true }}
                            loop={true}
                            modules={[EffectFade, Autoplay, Navigation]}
                            className="ourGenres"
                        >
                            {[...Array(4)].map((_, slideIndex) => (
                                <SwiperSlide key={`slide-${slideIndex}`}>
                                    <div className={styles.slide}>
                                        {genres.slice(slideIndex * interval, (slideIndex + 1) * interval).map((item, genreIndex) => (
                                            <div key={`genre-${_}-${item.id}-${slideIndex}-${genreIndex}`} className={styles["genre"]}>
                                                <div className={styles.images}>
                                                    {shows &&
                                                        shows
                                                            .filter((movie) => movie.genre_ids?.includes(item.id))
                                                            .slice(0, 4)
                                                            .map((filteredMovie, movieIndex) => (
                                                                <img
                                                                    key={`movie-${filteredMovie.id}-${item.id}-${slideIndex}-${movieIndex}`}
                                                                    src={`https://image.tmdb.org/t/p/original/${filteredMovie.poster_path}`}
                                                                    alt={`${filteredMovie.title || filteredMovie.name} Poster`}
                                                                />
                                                            ))}
                                                </div>
                                                <div className={styles["genre-title"]}>
                                                    <p>{item.name}</p>
                                                    <div className={styles.icon}>
                                                        <svg
                                                            width="28"
                                                            height="28"
                                                            viewBox="0 0 28 28"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M15.75 5.25L24.5 14M24.5 14L15.75 22.75M24.5 14H3.5"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </SwiperSlide>
                            ))}
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
                            modules={[EffectFade, Autoplay, Navigation]}
                            className="ourGenres"
                        >
                            {genres.map((item, index) => (
                                <SwiperSlide key={index} >
                                    <div className={styles["genre"]}>
                                        <div className={styles.images}>
                                            {shows && shows
                                                .filter(movie => movie.genre_ids?.includes(item.id)).slice(0, 4)
                                                .map(filteredMovie => (
                                                    <img key={filteredMovie.id}
                                                        src={`https://image.tmdb.org/t/p/original/${filteredMovie.poster_path}`}
                                                        alt={`${filteredMovie.title || filteredMovie.name} Poster`}
                                                    />

                                                ))}
                                        </div>
                                        <div className={styles["genre-title"]}>
                                            <p>{item.name}</p>
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

export default OurGenresShows