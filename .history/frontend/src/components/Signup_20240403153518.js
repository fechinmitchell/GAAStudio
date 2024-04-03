import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { auth, firestore } from './firebase';
import './AuthForm.css'; // Ensure the CSS file is imported

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      // You can handle this case by showing a custom error message if you want
      console.error('Email and password are required');
      return;
    }
    try {
      const { user } = await auth.createUserWithEmailAndPassword(email, password);
      await firestore.collection('users').doc(user.uid).set({
        email,
        // Add more user details if needed
      });
      navigate('/'); // Redirect to the home page or dashboard after sign up
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };

  return (
    <div className="auth-form-container">
      <form onSubmit={handleSignUp} className="auth-form">
        <h2>Sign Up</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required // Make the email input required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required // Make the password input required
        />
        <button type="submit">Sign Up</button>
        <div className="switch-auth">
          <span>Already have an account? </span>
          <button type="button" onClick={() => navigate('/signin')}>Sign In</button>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
