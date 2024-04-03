import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import './AuthForm.css';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const auth = getAuth();
  const firestore = getFirestore();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(firestore, "users", user.uid), {
        email: email,
        // Add more user details if needed
      });
      navigate('/'); // Redirect after successful sign-up
    } catch (error) {
      console.error('Error signing up:', error.message);
      alert(error.message); // Provide feedback to the user
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



