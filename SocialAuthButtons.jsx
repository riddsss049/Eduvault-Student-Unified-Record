import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "../lib/firebase";

const SocialAuthButtons = () => {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // Handle successful login (e.g., redirect or show a success message)
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
      // Handle successful login (e.g., redirect or show a success message)
    } catch (error) {
      console.error("Facebook sign-in error:", error);
    }
  };

  return (
    <div>
      <button onClick={handleGoogleSignIn} style={{ margin: 8 }}>
        Sign in with Google
      </button>
      <button onClick={handleFacebookSignIn} style={{ margin: 8 }}>
        Sign in with Facebook
      </button>
    </div>
  );
};

export default SocialAuthButtons;