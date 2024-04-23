import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import './AuthForm.css';
import backgroundImage from '../assets/background/CP_Login_2.jpeg'; // Updated background image path
import logo from '../assets/logo/logo_5_WB.png'; // Import the GAA Studio logo

function SignUp() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const auth = getAuth();
  const firestore = getFirestore();
  const storage = getStorage();

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
  
      // Upload profile picture to Firebase Storage
      let profilePicUrl = '';
      if (profilePic) {
        const profilePicRef = ref(storage, `profilePics/${user.uid}`);
        const snapshot = await uploadBytes(profilePicRef, profilePic);
        profilePicUrl = await getDownloadURL(snapshot.ref);
      }
  
      // Save user data to Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        email,
        fullName,
        profilePic: profilePicUrl
      });
  
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

  // Handle file input change
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    } else {
      setProfilePic(null);
    }
  };

  return (
    <div className="auth-form-container" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
      <form onSubmit={handleSignUp} className="auth-form">
        <img src={logo} alt="GAA Studio Logo" className="logo" /> {/* Add the GAA Studio logo */}
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
        <input
          type="file"
          onChange={handleFileChange}
          placeholder="Profile Picture"
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
            style={{ verticalAlign: 'middle', marginRight: '5px' }} // Adjust vertical alignment here
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

