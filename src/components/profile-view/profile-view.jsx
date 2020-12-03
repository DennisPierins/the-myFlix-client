import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
      movies: []
    };
  }

  // Gets user data from API
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

  onLoggedOut() {
    localStorage.removeItem('token');
    localStorage.removeitem('user');
    window.open('/', '_self');
  }

  componentDidMount() {
    const accessToken = localStorage.getItem('token');
    this.getUser(accessToken);
  }

  // deleteUser() {
  //   if (!confirm('Do you really want to delete your profile?')) return;
  //   axios.delete(`https://themyflixapi.herokuapp.com/users/${localStorage.getItem('user')}`, {
  //     headers: { Authorization: `Bearer ${localStorage.getItem('token')};` }
  //   })
  //     .then((res) =>
  //       console.log(res))
  //   alert('Your myFlix account has been deleted')
  //   this.onLoggedOut();
  // }

  deleteUser() {
    axios.delete(`https://themyflixapi.herokuapp.com/users/${localStorage.getItem('user')}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => {
        alert('Do you really want to delete your account?')
      })
      .then(res => {
        alert('Account was successfully deleted')
      })
      .then(res => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        this.setState({
          user: null

        });
        window.open('/', '_self');
      })
      .catch(e => {
        alert('Account could not be deleted ' + e)
      });
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

  render() {
    const { movies } = this.props;
    const userFavoriteMovies = this.state.FavoriteMovies;
    const FavoriteMoviesList = movies.filter((movie) => userFavoriteMovies.includes(movie._id));

    return (
      <Container>
        <Container>
          <h2 className="profile-title">Your Profile</h2>
          <Card style={{ width: '50rem' }} className="profile-view">
            <Card.Body>
              <Card.Text className='profile-text'>Username: {this.state.Username}</Card.Text>
              <Card.Text className='profile-text'>Email: {this.state.Email}</Card.Text>
              <Card.Text className='profile-text'>Birthday: {this.state.Birthday}</Card.Text>
              <div className='profile-buttons'>
                <Link to={'/users/:userId/update'}>
                  <Button variant="success" className='update-profile-button'>Update Profile</Button>
                </Link>
                <Button variant='danger' onClick={() => this.deleteUser()} className='delete-profile-button'>Delete Profile</Button>
                <Link to={'/'}>
                  <Button className='profile-go-back-button' variant='secondary'>Go Back</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Container>
        <Container>
          <h2 className='favorite-movies-title'>Your Favorite Movies</h2>
          {FavoriteMoviesList.map((movie) => {
            return (
              <Card key={movie._id} style={{ width: '15rem' }} className="favorite-movies mt-3 border border-dark rounded">
                <Card.Img className="favorite-movies-images" variant='top' src={movie.ImagePath} width={300} height={400} />
                <Card.Body className="favorite-movies-card-body">
                  <Link to={`/movies/${movie._id}`}>
                    <Button variant='link' className='fav-movie-info'>Movie Details</Button>
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
