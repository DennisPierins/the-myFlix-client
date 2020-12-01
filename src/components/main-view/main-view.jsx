import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { BrowserRouter as Router, Route } from "react-router-dom";

import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import { ProfileView } from '../profile-view/profile-view';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

// class MainView extends React.Component {
//   constructor() {
//     // Call the superclass constructor so React can initialize it
//     super();
//     // Initialize the state to an empty object so we can destructure it later
//     this.state = {};
//   }

//   // This overrider the render() method of the superclass. No need to call super(), it does nothing by default
//   render() {
//     return (
//       <div className="main-view"></div>
//     );
//   }
// }

export class MainView extends React.Component {

  constructor() {
    super();

    this.state = {
      movies: [],
      //selectedMovie: null,
      user: null
    };
  }

  // One of the "hooks" available in a React Component
  // componentDidMount() {
  //   axios.get('https://themyflixapi.herokuapp.com/movies')
  //     .then(response => {
  //       // Assign the result to the state
  //       this.setState({
  //         movies: response.data
  //       });
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // }

  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
    }
  }

  // When a movie is clicked, this function is invoked and updates the state of the 'selectedMovie' property to that movie
  // onMovieClick(movie) {
  //   this.setState({
  //     selectedMovie: movie
  //   });
  // }

  // Getting all the movies by passing bearer authorization in the header of the HTTP requests
  getMovies(token) {
    axios.get('https://themyflixapi.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        // Assign the result to the state
        this.setState({
          movies: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // When a user succesfully logs in, this function updates the 'user' property in state to that particular user
  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username
    });

    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
  }

  // This function logs out the user by removing token & user from the localStorage
  onLogOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  render() {
    // If the state isn't initialized, this will throw on runtime before the data is initially loaded
    const { movies, user } = this.state;

    // If there is no user, the LoginView is rendered. If there is a user logged in, the user details are passed as a prop to the LoginView
    // if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;

    // Before the movies have been loaded
    if (!movies) return <div className="main-view" />;

    // If the state of 'selectedMovie' is not null, that selected movie will be returned, otherwise: all movies will be returned
    return (
      <Router>
        <div className="main-view">
          <Navbar bg="light" expand="lg">
            <Navbar.Brand as={Link} to="/">myFlix</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/users/:Username">Profile</Nav.Link>
              </Nav>
              <Button onClick={this.onLogOut} variant="dark" type="submit" className="button log-out-button">Log Out</Button>
            </Navbar.Collapse>
          </Navbar>
          <Route exact path="/" render={() => {
            if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
            return movies.map(m => <MovieCard key={m._id} movie={m} />
            )
          }} />
          <Route exact path="/register" render={() => <RegistrationView />} />
          <Route path="/movies/:movieId" render={({ match }) => <MovieView movie={movies.find(m => m._id === match.params.movieId)} />} />
          <Route path="/directors/:name" render={({ match }) => {
            if (!movies) return <div className="main-view" />;
            return <DirectorView director={movies.find(m => m.Director.Name === match.params.name).Director} />
          }
          } />
          <Route path="/genres/:name" render={({ match }) => {
            if (!movies) return <div className="main-view" />;
            return <GenreView genre={movies.find(m => m.Genre.Name === match.params.name).Genre} />
          }
          } />
          <Route path="/users/:username" render={() => <ProfileView movies={movies} />
          } />
          <Route exact path="/users/:Username/update" render={() =>
            <ProfileUpdate movies={movies} />} />
          <Route path="/logout" render={() => <LoginView />} />
        </div>
      </Router>
    );
  }
}