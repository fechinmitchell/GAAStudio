import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import './AuthForm.css'; // Import the styles here

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      navigate('/'); // Navigate to the home page after sign in
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="auth-form-container">
      <form onSubmit={handleSignIn} className="auth-form">
        <h2>Sign In</h2>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
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
