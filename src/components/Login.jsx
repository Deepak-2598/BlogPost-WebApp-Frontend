import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      try {
        const response = await fetch('http://localhost:8080/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password, email }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Sign Up failed');
        }

        console.log('User signed up:', { username });
        navigate('/home');

      } catch (error) {
        setError(error.message);
      }
    } else {
      try {
        const response = await fetch('http://localhost:8080/api/data');
        const users = await response.json();

        const userExists = users.some(user => user.username === username && user.password === password);

        if (!userExists) {
          throw new Error('User not found');
        }

        console.log('User signed in:', { username });
        navigate('/home');

      } catch (error) {
        setError(error.message);
      }
    }
  };

  return (
    <div className="app-container">
      <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
      {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isSignUp && (
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
        <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
      </form>
      <p>
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
        <span className="toggle" onClick={toggleForm}>
          {isSignUp ? ' Sign In' : ' Sign Up'}
        </span>
      </p>
    </div>
  );
}

export default Login;
