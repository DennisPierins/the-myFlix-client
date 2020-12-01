import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './profile-view.scss';

export class ProfileView extends React.Component {

  constructor() {
    super();

    this.state = {
      Username: null,
      Password: null,
      Email: null,
      Birthday: null,
      FavoriteMovies: [],
    };
  }

  getUser(token) {
    const userId = localStorage.getItem('user');

    axios.get(`https://themyflixapi.herokuapp.com/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        this.setState({
          Username: res.data.Username,
          Password: res.data.Password,
          Email: res.data.Email,
          Birthday: res.data.Birthday,
          FavoriteMovies: res.data.FavoriteMovies
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidMount() {
    const accessToken = localStorage.getItem('token');
    this.getUser(accessToken);
  }

  deleteUser(token) {
    const userId = localStorage.getItem('user');
    if (!confirm('This will delete your myFlix profile. Are you sure?')) return;
    axios.delete(`https://themyflixapi.herokuapp.com/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) =>
        console.log(res))
    localStorage.removeItem('token');
    window.open('/', '_self');
  }

  deleteFavoriteMovie(movie) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user');

    axios.delete(`https://themyflixapi.herokuapp.com/users/${userId}/Movies/${movie._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        console.log(res);
        this.componentDidMount();
      });
  }

  onLoggedOut() {
    localStorage.removeItem('token');
    localStorage.removeitem('user');
    window.open('/', '_self');
  }

  render() {
    const { movies } = this.props;
    const userFavoriteMovies = this.state.FavoriteMovies;
    const FavoriteMoviesList = movies.filter((movie) => userFavoriteMovies.includes(movie._id));

    return (
      <Container>
        <h2 className="profile-title">Your Profile</h2>
        <Card style={{ width: '50rem' }} className="profile-view">
          <Card.Body>
            <Card.Text className='profile-text'>Username: {this.state.Username}</Card.Text>
            <Card.Text className='profile-text'>Email: {this.state.Email}</Card.Text>
            <Card.Text className='profile-text'>Birthday: {this.state.Birthday}</Card.Text>
            <div className='profile-buttons'>
              <Link to={'/users/:userId/update'}>
                <Button variant="warning" className='update-profile-button'>Update Profile</Button>
              </Link>
              <Button variant='danger' onClick={() => this.deleteUser()} className='delete-profile-button'>Delete Profile</Button>
              <Link to={'/'}>
                <Button className='profile-go-back-button' variant='secondary'>Go Back</Button>
              </Link>
            </div>
          </Card.Body>
        </Card>
        <Container>
          <h2 className='favorite-movies-title'>Your Favorite Movies</h2>
          {FavoriteMoviesList.map((movie) => {
            return (
              <Card key={movie._.id} style={{ width: '15rem' }} className="favoite-movies">
                <Card.Img variant='top' src={movie.ImagePath} />
                <Card.Body>
                  <Link to={'/movies/${movie._id}'}>
                    <Button variant='link' className='fav-movie-info'>Movie Info</Button>
                  </Link>
                  <Button variant='link' className='fav-movie-remove' onClick={() => this.deleteFavoriteMovie(movie)}>Remove Movie</Button>
                </Card.Body>
              </Card>
            );
          })}
        </Container>
      </Container>
    );
  }
}

ProfileView.propTypes = {
  user: PropTypes.shape({
    Username: PropTypes.string.isRequired,
    Password: PropTypes.string.isRequired,
    Email: PropTypes.string.isRequired,
    Birthday: PropTypes.instanceOf(Date).isRequired,
    FavoriteMovies: PropTypes.array
  })
}
