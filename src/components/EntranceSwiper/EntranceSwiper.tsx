import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import 'swiper/css/effect-fade';
import styles from "./entranceSwiper.module.scss"
import CustomPagination from '../SwiperPagination/SwiperPagination';
import SwiperCore from 'swiper';

SwiperCore.use([Navigation, EffectFade, Autoplay]);

interface Movie {
    backdrop_path: string | null;
    poster_path: string | null;
    overview: string | null;
    name?: string | null;
    title?: string | null;
}

interface Props {
    movies: Movie[];
}

const EntranceSwiper: React.FC<Props> = ({ movies }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef<SwiperCore | null>(null);
    const [mute, setMute] = useState<boolean>(true)
    const [showTrailer, setShowTrailer] = useState<boolean>(false)
    const [likedStates, setLikedStates] = useState<boolean[]>(movies.map(() => false));

    const handleBulletClick = (index: number) => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(index);
        }
    };

    const handleLikeToggle = (index: number) => {
        setLikedStates((prev) => {
            const newState = [...prev];
            newState[index] = !newState[index];
            return newState;
        })
    };

    const handleMove = () => {
        setShowTrailer(true)
    }

    const handleLeave = () => {
        setShowTrailer(false)
    }

    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.on('slideChange', () => {
                setActiveIndex(swiperRef.current!.realIndex);
            });
        }
    }, []);

    return (
        <>
            <Swiper
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                navigation={{
                    nextEl: ".next-slide",
                    prevEl: ".prev-slide",
                }}
                effect={'fade'}
                spaceBetween={30}
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 10000,
                    disableOnInteraction: false,
                }}
                loop={true}
                modules={[EffectFade, Autoplay, Navigation]}
                className="mySwiper"
            >
                {movies &&
                    movies.map((item, index) => (
                        <SwiperSlide key={index} onMouseEnter={handleMove} onMouseLeave={handleLeave}>
                            <div className={styles.movie}>
                                {/* Mobile Design  */}
                                <div className={styles.bgImage}>
                                    <img
                                        src={`https://image.tmdb.org/t/p/original/${item.poster_path}`}
                                        alt={`${item.name || item.title} Poster`}
                                        loading="lazy"
                                    />

                                </div>
                                {/* Desktop Design  */}
                                <div className={styles["desktop-bgImage"]}>

                                    <img
                                        src={`https://image.tmdb.org/t/p/original/${item.backdrop_path}`}
                                        alt={`${item.name || item.title} Poster`}
                                        loading="lazy"
                                    />
                                    {
                                        showTrailer ? (
                                            <video
                                                autoPlay={true}
                                                loop
                                                muted={mute}
                                                playsInline
                                                className="mx-auto px-5 xl:px-10"
                                            >
                                                <source src="/Deadpool&WolverineTrailer.mp4" type="video/mp4" />
                                            </video>
                                        ) : (
                                            <></>
                                        )
                                    }
                                </div>
                                <div className={styles["movie-content"]}>
                                    <h1>{item.name || item.title}</h1>
                                    <p className={styles.overview}>{item.overview}</p>
                                    <div className={styles["movie-other"]}>
                                        <button className="btn-primary">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="28"
                                                height="28"
                                                viewBox="0 0 29 28"
                                                fill="none"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M5.75 6.59479C5.75 4.93097 7.53383 3.87624 8.9917 4.67807L22.4557 12.0833C23.9668 12.9144 23.9668 15.0856 22.4557 15.9167L8.9917 23.3219C7.53383 24.1238 5.75 23.069 5.75 21.4052V6.59479Z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                            <span>Play Now</span>
                                        </button>
                                        <div className={styles.buttons}>
                                            <button className="btn-dark">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="28"
                                                    height="28"
                                                    viewBox="0 0 29 28"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M14.5 7V21M21.5 14L7.5 14"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>
                                            <button className={`btn-dark ${likedStates[index] ? styles.active : ""}`} onClick={() => handleLikeToggle(index)}>

                                                {
                                                    likedStates[index] ? <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 29 25" fill="none">
                                                        <g filter="url(#filter0_d_501_3627)">
                                                            <path d="M10.4928 18.5C10.0682 18.5 9.67296 18.2635 9.51759 17.8684C9.18349 17.0187 9 16.0933 9 15.125C9 13.3759 9.59874 11.7667 10.6024 10.491C10.7533 10.2993 10.9746 10.1821 11.2021 10.094C11.675 9.91091 12.0925 9.57968 12.4141 9.16967C13.1873 8.18384 14.1617 7.3634 15.2755 6.77021C15.9977 6.38563 16.6243 5.81428 16.9281 5.05464C17.1408 4.5231 17.25 3.95587 17.25 3.38338V2.75C17.25 2.33579 17.5858 2 18 2C19.2426 2 20.25 3.00736 20.25 4.25C20.25 5.40163 19.9904 6.49263 19.5266 7.46771C19.261 8.02604 19.6336 8.75 20.2519 8.75H23.3777C24.4044 8.75 25.3233 9.44399 25.432 10.4649C25.4769 10.8871 25.5 11.3158 25.5 11.75C25.5 14.5976 24.5081 17.2136 22.851 19.2712C22.4634 19.7525 21.8642 20 21.2462 20H17.2302C16.7466 20 16.2661 19.922 15.8072 19.7691L12.6928 18.7309C12.2339 18.578 11.7534 18.5 11.2698 18.5H10.4928Z" fill="currentColor" />
                                                            <path d="M5.33149 10.7271C4.79481 12.0889 4.5 13.5725 4.5 15.125C4.5 16.3451 4.68208 17.5226 5.02056 18.632C5.27991 19.482 6.10418 20 6.99289 20H7.90067C8.3462 20 8.62137 19.5017 8.42423 19.1022C7.83248 17.9029 7.5 16.5528 7.5 15.125C7.5 13.4168 7.97588 11.8198 8.8023 10.4593C9.0473 10.0559 8.77404 9.5 8.30212 9.5H7.24936C6.41733 9.5 5.63655 9.95303 5.33149 10.7271Z" fill="currentColor" />
                                                        </g>
                                                        <defs>
                                                            <filter id="filter0_d_501_3627" x="-1" y="0" width="28" height="28" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                                <feOffset dy="4" />
                                                                <feGaussianBlur stdDeviation="2" />
                                                                <feComposite in2="hardAlpha" operator="out" />
                                                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_501_3627" />
                                                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_501_3627" result="shape" />
                                                            </filter>
                                                        </defs>
                                                    </svg> : <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="28"
                                                        height="28"
                                                        viewBox="0 0 29 28"
                                                        fill="none"
                                                    >
                                                        <path
                                                            d="M8.238 11.9584C9.17874 11.9584 10.0276 11.4382 10.6081 10.698C11.5101 9.54785 12.647 8.59067 13.9465 7.89862C14.789 7.44994 15.52 6.78337 15.8745 5.89712C16.1226 5.27699 16.25 4.61522 16.25 3.94732V3.20837C16.25 2.72512 16.6418 2.33337 17.125 2.33337C18.5747 2.33337 19.75 3.50863 19.75 4.95837C19.75 6.30194 19.4472 7.57478 18.9061 8.71236C18.5962 9.36376 19.0309 10.2084 19.7522 10.2084M19.7522 10.2084H23.399C24.5968 10.2084 25.6689 11.018 25.7957 12.209C25.8481 12.7016 25.875 13.2019 25.875 13.7084C25.875 17.0306 24.7178 20.0825 22.7845 22.4831C22.3323 23.0446 21.6332 23.3334 20.9123 23.3334H16.227C15.6627 23.3334 15.1021 23.2424 14.5668 23.064L10.9332 21.8528C10.3979 21.6743 9.83732 21.5834 9.27304 21.5834H7.38824M19.7522 10.2084H17.125M7.38824 21.5834C7.48485 21.822 7.58999 22.0564 7.70327 22.2859C7.93326 22.7521 7.61223 23.3334 7.09245 23.3334H6.03337C4.99654 23.3334 4.0349 22.729 3.73232 21.7373C3.33743 20.4431 3.125 19.0693 3.125 17.6459C3.125 15.8347 3.46894 14.1038 4.09507 12.515C4.45097 11.6119 5.36189 11.0834 6.33258 11.0834H7.5608C8.11138 11.0834 8.43019 11.7319 8.14435 12.2025C7.1802 13.7898 6.625 15.653 6.625 17.6459C6.625 19.0383 6.89604 20.3674 7.38824 21.5834Z"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                }


                                            </button>
                                            <button className="btn-dark" onClick={() => setMute(prev => !prev)}>
                                                {
                                                    mute ? <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none">
                                                        <path
                                                            d="M17.25 9.74999L19.5 12M19.5 12L21.75 14.25M19.5 12L21.75 9.74999M19.5 12L17.25 14.25M6.75 8.24999L11.4697 3.53032C11.9421 3.05784 12.75 3.39247 12.75 4.06065V19.9393C12.75 20.6075 11.9421 20.9421 11.4697 20.4697L6.75 15.75H4.50905C3.62971 15.75 2.8059 15.2435 2.57237 14.3957C2.36224 13.6329 2.25 12.8296 2.25 12C2.25 11.1704 2.36224 10.367 2.57237 9.60423C2.8059 8.75646 3.62971 8.24999 4.50905 8.24999H6.75Z"
                                                            stroke="currentColor"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round" />
                                                    </svg> :
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="28"
                                                            height="28"
                                                            viewBox="0 0 29 28"
                                                            fill="none"
                                                        >
                                                            <path
                                                                d="M22.7997 6.57535C26.9002 10.6759 26.9002 17.3241 22.7997 21.4246M19.7064 9.66904C22.0984 12.061 22.0984 15.9391 19.7064 18.3311M8.375 9.62504L13.8813 4.11875C14.4325 3.56753 15.375 3.95793 15.375 4.73747V23.2626C15.375 24.0421 14.4325 24.4325 13.8813 23.8813L8.375 18.375H5.76056C4.73466 18.375 3.77356 17.7842 3.5011 16.7951C3.25595 15.9052 3.125 14.9679 3.125 14C3.125 13.0322 3.25595 12.0949 3.5011 11.205C3.77356 10.2159 4.73466 9.62504 5.76056 9.62504H8.375Z"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                }


                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                <div className={styles.pagination}>
                    <button className="prev-slide btn-dark">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.75 14L5.25 14M5.25 14L13.125 21.875M5.25 14L13.125 6.125" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    <CustomPagination
                        totalSlides={movies.length}
                        activeIndex={activeIndex}
                        onBulletClick={handleBulletClick}
                    />

                    <button className="next-slide btn-dark">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.75 5.25L24.5 14M24.5 14L15.75 22.75M24.5 14H3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </Swiper>
        </>
    );
};

export default EntranceSwiper;
