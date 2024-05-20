import { useContext, useState } from 'react';
import styles from "./movies&shows.module.scss";
import EntranceSwiper from '../../components/EntranceSwiper/EntranceSwiper';
import OurGenresMovies from '../../components/OurGenres/OurGenresMovies';
import OurGenresShows from '../../components/OurGenres/OurGenresShows';
import NewReleasesMovies from '../../components/NewReleases/NewReleasesMovies';
import MustWatchMovies from '../../components/MustWatchMovies/MustWatchMovies';
import TrendingNowMovies from '../../components/TrendingNow/TrendingNowMovies';
import PopularTopGenresMovies from '../../components/PopularTopGenres/PopularTopGenresMovies';
import PopularTopGenresShows from '../../components/PopularTopGenres/PopularTopGenresShows';
import TrendingNowShows from '../../components/TrendingNow/TrendingNowShows';
import NewReleasesShows from '../../components/NewReleases/NewReleasesShows';
import MustWatchShows from '../../components/MustWatchMovies/MustWatchShows';
import { DataContext } from '../../context/DataContext';



const MoviesShows = () => {
  const { movies } = useContext(DataContext);
  const { shows } = useContext(DataContext);
  const [showMovie, setShowMovie] = useState<boolean>(true);

  return (

    <>
      <div className={styles.entrance}>
        <div className="container">
          <div className={styles.slider}>
            <EntranceSwiper movies={movies.slice(33, 37)} />
          </div>
          <div className={styles["toogle_btn"]}>
            <button className={`${showMovie ? styles.active : ""}`} onClick={() => setShowMovie(true)}>Movies</button>
            <button className={`${showMovie ? "" : styles.active}`} onClick={() => setShowMovie(false)}>Shows</button>
          </div>
          <div className="movies&shows">
            <div className={`${styles.movies} ${showMovie ? styles.show : styles.hidden}`}>
              <div className={styles["movies-container"]}>
                <button className={`btn-primary ${styles.button}`}>Movies</button>
                <OurGenresMovies movies={movies} />
                {movies && <PopularTopGenresMovies movies={movies} />}
                <TrendingNowMovies />
                <NewReleasesMovies />
                <MustWatchMovies />
              </div>
            </div>
            <div className={`${styles.movies} ${!showMovie ? styles.show : styles.hidden}`}>
              <div className={styles["shows-container"]}>
                <button className={`btn-primary ${styles.button}`}>Shows</button>
                <OurGenresShows shows={shows} />
                {shows && <PopularTopGenresShows shows={shows} />}
                <TrendingNowShows />
                <NewReleasesShows />
                <MustWatchShows />
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  )
}

export default MoviesShows