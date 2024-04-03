import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import './AuthForm.css'; // Import the styles here

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const auth = getAuth(); // Initialize Firebase Auth

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      // Sign in using Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // Navigate to the home page after sign in
    } catch (error) {
      console.error('Error signing in:', error);
      alert(error.message); // Display the error message to the user
    }
  };

  return (
    <div className="auth-form-container">
      <form onSubmit={handleSignIn} className="auth-form">
        <h2>Sign In</h2>
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
        <button type="submit">Sign In</button>
        <div className="switch-auth">
          <span>Don't have an account? </span>
          <button type="button" onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
