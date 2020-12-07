import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import './movie-view.scss';
import axios from 'axios';

export class MovieView extends React.Component {

  constructor() {
    super();

    this.state = {};
  }

  addToFavoriteMovies(movie) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user');
    axios.post(`https://themyflixapi.herokuapp.com/users/${userId}/Movies/${movie._id}`,
      { username: localStorage.getItem('user') },
      {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        console.log(res);
        alert('This movie has been added to your Favorites.');
      });
  }

  render() {
    const { movie, onClick } = this.props;

    if (!movie) return null;

    return (
      <div className="movie-view">
        <h2>{movie.Title}</h2>
        <section className="movie-poster-section">
          <img className="movie-poster" src={movie.ImagePath} width={300} height={450} />
        </section>
        <section>
          <div className='favorite-button'>
            <Button onClick={() => this.addToFavoriteMovies(movie)} className="button-add-favorite" style={{ background: '#690f38' }}>Add to Favorite Movies</Button>
          </div>
        </section>
        <section className="movie-info-section">
          <div className="movie-description">
            <span className="label">Description: </span>
            <span className="value">{movie.Description}</span>
          </div>
          <div className="movie-genre">
            <span className="label">Genre:</span>
            <Link to={`/genres/${movie.Genre.Name}`}>
              <Button className="genre-button" variant="link">{movie.Genre.Name}</Button>
            </Link>
          </div>
          <div className="movie-director">
            <span className="label">Director:</span>
            <Link to={`/directors/${movie.Director.Name}`}>
              <Button className="director-button" variant="link">{movie.Director.Name}</Button>
            </Link>
          </div>
          <Link to={"/"}>
            <Button className="back-button" variant="secondary">Go Back</Button>
          </Link>
        </section>
      </div>
    );
  }
}

MovieView.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    ImagePath: PropTypes.string.isRequired,
    Genre: PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Description: PropTypes.string.isRequired
    }),
    Director: PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Bio: PropTypes.string.isRequired,
      Birth: PropTypes.string.isRequired,
      Death: PropTypes.string
    }),
  })
}