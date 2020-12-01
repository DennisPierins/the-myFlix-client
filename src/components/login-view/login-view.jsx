import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import './login-view.scss';

export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // // Allows login with random credentials for existing user, no functionality for new users yet
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log(username, password);
  //   // Send a request to the server for authentication then call props.onLoggedIn(username)
  //   props.onLoggedIn(username);
  // };

  // Requesting server for authentication
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://themyflixapi.herokuapp.com/login', {
      Username: username,
      Password: password
    })
      .then(response => {
        const data = response.data;
        props.onLoggedIn(data);
        console.log('You succesfully logged in')
      })
      .catch(e => {
        console.log('No such user')
      });
  };

  return (
    <div className="login-view">
      <h2>Welcome to MyFlix!</h2>
      <Form className="login-form">
        <Form.Group controlId="formBasicUsername" className="login-form-group">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter Username" />
        </Form.Group>

        <Form.Group controlId="formBasicPassword" className="login-form-group">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter Password" />
        </Form.Group>
        <Button variant="primary" type="submit" className="login-button" onClick={handleSubmit}>Submit</Button>
        <Link to={"/register"}>
          <Button variant="success" className="button-register ml-1">Register</Button>
        </Link>
      </Form>
    </div>
  );
}


LoginView.propTypes = {
  user: PropTypes.shape({
    Username: PropTypes.string.isRequired,
    Password: PropTypes.string.isRequired
  }),
  onLoggedIn: PropTypes.func.isRequired,
}