import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from './firebase';
import './AuthForm.css';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }
    try {
      const { user } = await auth.createUserWithEmailAndPassword(email, password);
      await firestore.collection('users').doc(user.uid).set({ email });
      navigate('/'); // Redirect after successful sign-up
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
          required
        />
        <div className="password-input-container">
          <input
            type={passwordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="view-password-button"
          >
            {passwordVisible ? "Hide" : "Show"}
          </button>
        </div>
        <div className="password-input-container">
          <input
            type={passwordVisible ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="view-password-button"
          >
            {passwordVisible ? "Hide" : "Show"}
          </button>
        </div>
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


