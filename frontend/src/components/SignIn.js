import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import './AuthForm.css';
import backgroundImage from '../assets/background/CP_Login_2.jpeg'; // Updated background image path
import logo from '../assets/logo/logo_5_WB.png'; // Import the GAA Studio logo

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage('Successfully signed in!');
      navigate('/'); // Navigate to the home page after sign in
    } catch (error) {
      console.error('Error signing in:', error);
      setMessage(error.message); // Display the error message to the user
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
      <form onSubmit={handleSignIn} className="auth-form">
        <img src={logo} alt="GAA Studio Logo" className="logo" />
          <h2>Sign In</h2>
          {message && <div className="auth-message">{message}</div>}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          <div className="switch-auth">
            <span>Don't have an account? </span>
            <button type="button" onClick={() => navigate('/signup')}>Sign Up</button>
          </div>
        </form>
      </div>
  );
}

export default SignIn;
