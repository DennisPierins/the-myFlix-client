import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export function RegistrationView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');

  // Allows login with random credentials for existing user, no functionality for new users yet
  const handleRegister = (e) => {
    e.preventDefault();
    console.log(username, password, email, birthday);
    // Send a request to the server for authentication then call props.onLoggedIn(username)
    props.onLoggedIn(username);
  };

  return (
    <div className="registration-view">
      <h2>Join MyFlix!</h2>
      <Form className="registration-form">
        <Form.Group controlId="formBasicUsername" className="registration-form-group">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Create Username" />
        </Form.Group>

        <Form.Group controlId="formBasicPassword" className="registration-form-group">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New Password" />
        </Form.Group>

        <Form.Group controlId="formBasicEmail" className="registration-form-group">
          <Form.Label>Emailaddress</Form.Label>
          <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your Emailaddress" />
        </Form.Group>

        <Form.Group controlId="formBasicBirthday" className="registration-form-group">
          <Form.Label>Birthday</Form.Label>
          <Form.Control type="date" value={birthday} onChange={e => setBirthday(e.target.value)} placeholder="Your Birthday - YYYY-MM-DD" />
        </Form.Group>

        <Button variant="primary" type="submit" className="register-button" onClick={handleRegister}>Register</Button>
      </Form>
    </div>
  );
}

RegistrationView.propTypes = {
  user: PropTypes.shape({
    Username: PropTypes.string.isRequired,
    Password: PropTypes.string.isRequired,
    Email: PropTypes.string.isRequired,
    Birthday: PropTypes.instanceOf(Date).isRequired
  })
}