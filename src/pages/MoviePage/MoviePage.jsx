import { getMovieDetails } from 'utils/api';
import { useParams, useLocation, Link, Outlet } from 'react-router-dom';
import { useEffect, useState, Suspense } from 'react';
import css from './MoviePage.module.css';
// import PropTypes from 'prop-types';

const MoviePage = () => {
  const [title, setTitle] = useState('');
  const [poster, setPoster] = useState('');
  const [score, setScore] = useState(0);
  const [overview, setOverview] = useState(`none`);
  const [genres, setGenres] = useState('');

  const { movieId } = useParams();
  const location = useLocation();
  const backLinkHref = location.state?.from ?? '/';

  const getMovieInfo = async id => {
    const movie = await getMovieDetails(id);
    setTitle(movie.title);
    setPoster(`https://image.tmdb.org/t/p/w500${movie.poster_path}`);
    setScore(Math.round(movie.vote_average * 100) / 100);
    if (movie.overview) {
      setOverview(movie.overview);
    }

    let genresArray = [];
    movie.genres.map(genre => {
      return (genresArray = [...genresArray, genre.name]);
    });
    setGenres(genresArray.join(', '));
  };
  useEffect(() => {
    getMovieInfo(movieId);
  }, [movieId]);

  return (
    <div>
      <Link to={backLinkHref} state={{ from: location }}>
        <button type="button" className={css.backButton}>
          ← Go back
        </button>
      </Link>
      <div className={css.movieCardContainer}>
        <img className={css.movieImg} src={poster} alt={`${title} poster`} />
        <div className={css.movieDetailsContainer}>
          <h1>{title}</h1>
          <p>
            User score: <span className={css.userScore}>{score}</span>
          </p>
          <h2>Overwiew</h2>
          <p>{overview}</p>
          <h2>Genres</h2>
          <p>{genres}</p>
          <div className={css.additionalInfoContainer}>
            <h3>Addiditonal information</h3>
            <ul>
              <li>
                <Link to={'cast'} state={{ from: location.state.from }}>
                  Cast
                </Link>
              </li>
              <li>
                <Link to={'reviews'} state={{ from: location.state.from }}>
                  Reviews
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default MoviePage;
