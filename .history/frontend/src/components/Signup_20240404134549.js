import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Commented out for profile picture feature
import './AuthForm.css';
import backgroundImage from '../assets/background/CP_Login_2.jpeg';
import logo from '../assets/logo/logo_5_WB.png';

function SignUp() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [profilePic, setProfilePic] = useState(null); // Commented out for profile picture feature
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const auth = getAuth();
  const firestore = getFirestore();
  // const storage = getStorage(); // Commented out for profile picture feature

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords don't match.");
      return;
    }
  
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Profile picture upload and Firestore data save logic is commented out

      setMessage('Successfully signed up!');
      navigate('/'); // Redirect after successful sign-up
    } catch (error) {
      console.error('Error signing up:', error.message);
      if (error.code === 'auth/email-already-in-use') {
        setMessage('Email is already in use.');
      } else {
        setMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Commented out profile picture file change handler
  /*
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    } else {
      setProfilePic(null);
    }
  };
  */

  return (
    <div className="auth-form-container" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
      <form onSubmit={handleSignUp} className="auth-form">
        <img src={logo} alt="GAA Studio Logo" className="logo" />
        <h2>Sign Up</h2>
        {message && <div className="auth-message">{message}</div>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          required
        />
        {/* Profile picture input commented out */}
        <button
          type="button"
          onClick={() => setPasswordVisible(!passwordVisible)}
          style={{
            width: '100%', // Match the width of the "Sign Up" button
            padding: '0.6rem 1rem', // Match the padding of the "Sign Up" button for consistent height and appearance
            background: '#007bff', // Match the color of the "Sign Up" button
            color: 'white', // Text color to match the "Sign Up" button
            border: 'none', // Remove default button border
            borderRadius: '4px', // Match the border radius of the "Sign Up" button
            cursor: 'pointer', // Cursor pointer to indicate clickable button
            margin: '1rem 0', // Provide margin to space it from other elements, matching the "Sign Up" button spacing
          }}
        >
          {passwordVisible ? "Hide Password" : "Show Password"}
        </button>
        <div className="password-input-container">
          <input
            type={passwordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <div className="password-input-container">
          <input
            type={passwordVisible ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
        <div className="switch-auth">
          <span>Already have an account? </span>
          <button type="button" onClick={() => navigate('/signin')}>Sign In</button>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
