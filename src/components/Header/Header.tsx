import { Link, useLocation } from "react-router-dom";
import styles from "./header.module.scss";
import { links } from "../../libs/data";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { DataContext } from "../../context/DataContext";

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

interface Genre {
  id: number;
  name: string;
}

const Header = () => {
  const location = useLocation();
  const pathName = location.pathname;
  // const [showHeader, setShowHeader] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const { data, genres } = useContext(DataContext);
  const [searchedData, setSearchedData] = useState<Shows[] | Movie[]>([])
  const [searchedValue, setSearchedValue] = useState<string>("")

  // const handleScroll = (): void => {
  //   if (window.scrollY > 0) {
  //     setShowHeader(true);
  //   } else {
  //     setShowHeader(false);
  //   }
  // };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const trimmedValue = e.target.value.trim().toLowerCase();
    setSearchedValue(trimmedValue);
  };

  useEffect(() => {
    if (searchedValue.trim() === '') {
      setSearchedData([]);
    } else {
      const genre: Genre[] = genres.filter(item => item.name.toLowerCase().includes(searchedValue))
      const filteredData = data.filter(item =>
        (item.title?.toLowerCase().includes(searchedValue) || item.name?.toLowerCase().includes(searchedValue) || item.genre_ids?.includes(genre[0]?.id))
      );
      setSearchedData(filteredData);
    }
  }, [searchedValue, data]);


  const handleResize = (): void => {
    if (window.innerWidth > 768) {
      setShowSidebar(false);
    }
  }

  useEffect(() => {
    handleResize()
    // window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize)

    return () => {
      // window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className={`${styles.header}`}>
      <div className="container">
        <div className={`${styles['header-inner']}`}>
          <div className={styles.logo}>
            <Link to='/'>
              <img src="./logo.png" alt="logo" />
            </Link>
          </div>
          {/* Desktop Design  */}
          <nav>
            <ul className={styles.navbar}>
              {links.map((link) => (
                <li key={link.path}>
                  <Link className={`${styles.link} ${pathName == link.path ? styles.active : ""}`} to={link.path} aria-label={link.title}>
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles["navbar-icons"]}>
            <button className={styles.search} onClick={() => setShowSearchBar(true)}>
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
            <button className={styles.notification}>
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
            </button>
          </div>

          {/* Mobile Design  */}
          <div className={styles['mobile-design']}>
            <input
              className={styles.checkbox}
              type="checkbox"
              id="checkbox"
              checked={showSidebar}
              onChange={() => setShowSidebar(prev => !prev)} />
            <label className={styles.toggle} htmlFor="checkbox">
              <div className={`${styles.bars} ${styles.bar1}`}></div>
              <div className={`${styles.bars} ${styles.bar2}`}></div>
              <div className={`${styles.bars} ${styles.bar3}`}></div>
            </label>
          </div>
          {
            showSidebar && <div className={styles.sidebar}>
              <nav>
                <ul className={styles["mobile-navbar"]}>
                  {links.map((link) => (
                    <li key={link.path}>
                      <Link className={`${pathName == link.path ? styles["mobile-active"] : ""}`} onClick={() => setShowSidebar(false)} to={link.path} aria-label={link.title}>
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          }
          {
            showSearchBar &&
            <div className={styles.searchBar} >
              <div className={styles.group}>
                <svg className={styles.icon} aria-hidden="true" viewBox="0 0 24 24">
                  <g>
                    <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z">
                    </path>
                  </g>
                </svg>
                <input placeholder="Search" type="search" className={styles.input} onChange={handleSearch} />
                <button onClick={() => { setShowSearchBar(false), setSearchedData([]) }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M5.46967 5.46967C5.76256 5.17678 6.23744 5.17678 6.53033 5.46967L12 10.9393L17.4697 5.46967C17.7626 5.17678 18.2374 5.17678 18.5303 5.46967C18.8232 5.76256 18.8232 6.23744 18.5303 6.53033L13.0607 12L18.5303 17.4697C18.8232 17.7626 18.8232 18.2374 18.5303 18.5303C18.2374 18.8232 17.7626 18.8232 17.4697 18.5303L12 13.0607L6.53033 18.5303C6.23744 18.8232 5.76256 18.8232 5.46967 18.5303C5.17678 18.2374 5.17678 17.7626 5.46967 17.4697L10.9393 12L5.46967 6.53033C5.17678 6.23744 5.17678 5.76256 5.46967 5.46967Z" fill="currentColor" />
                  </svg>
                </button>
              </div>
              {searchedData.length > 0 &&
                <div className={styles.searchContainer}>
                  {searchedData.map((item, index) => (
                    <div key={index} className={styles.movie}>
                      <div className={styles.image}>
                        <img className={styles.desktop} loading="lazy" src={`https://image.tmdb.org/t/p/original/${item.poster_path}`} />
                        <img className={styles.mobile} loading="lazy" src={`https://image.tmdb.org/t/p/original/${item.backdrop_path}`} />
                      </div>
                      <div className={styles["content"]}>
                        <div className={styles["heading"]}>
                          <h3>{item.title || item.name}</h3>
                          <div className={styles["stars"]}>
                            {Array.from({ length: 5 }).map((_, index) => {
                              if (Math.ceil(item.vote_average / 2) > index) {
                                return (
                                  <svg key={`${item.id}${index}`} xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                                    <path d="M9 0L12.1158 4.7114L17.5595 6.21885L14.0416 10.6381L14.2901 16.2812L9 14.301L3.70993 16.2812L3.95845 10.6381L0.440492 6.21885L5.88415 4.7114L9 0Z" fill="#e50000" />
                                  </svg>
                                )
                              }
                              return (
                                <svg key={`${item.id}${index}`} xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                                  <path d="M9 0L12.1158 4.7114L17.5595 6.21885L14.0416 10.6381L14.2901 16.2812L9 14.301L3.70993 16.2812L3.95845 10.6381L0.440492 6.21885L5.88415 4.7114L9 0Z" fill="#999" />
                                </svg>
                              );
                            })}
                          </div>
                        </div>
                        <div className={styles.genres}>
                          {item.genre_ids?.map(id => {
                            const genre = genres.find(genre => genre.id === id);
                            return genre ? <span key={id}>{genre.name}</span> : null;
                          })}
                        </div>
                        <p>{item.overview}</p>
                      </div>
                    </div>
                  ))}
                </div>
              }
            </div>
          }
        </div>
      </div>
    </header>
  )
}

export default Header