import { createContext, useContext, useEffect, useState } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from "firebase/auth";

import { auth } from "../firebase";

const authContext = createContext();

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) throw new Error("There is no Auth provider");
  return context;
};

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  

  const sendsignlink = (email) => {

    const actionCodeSettings = {
      // Replace this URL with the URL where the user will complete sign-in.
      url: 'https://esat-alpha-26c1b.firebaseapp.com',
      handleCodeInApp: true
    };

    return sendSignInLinkToEmail(auth, email, actionCodeSettings);

  };

  const isSignEmail = ()=> {

    return isSignInWithEmailLink(auth, window.location.href);

  }

  const signInWithEmail = (email) =>{

    return signInWithEmailLink(auth, email, window.location.href)

  }

  const loginWithGoogle = () => {
    const googleProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleProvider);
  };

  const loginWithFacebook = () => {
    const facebookProvider = new FacebookAuthProvider();
    facebookProvider.addScope('email');

    facebookProvider.setCustomParameters({
      'display': 'popup'
    });
    
    return signInWithPopup(auth, facebookProvider);
  };

  const logout = () => signOut(auth);

  const resetPassword = async (email) => sendPasswordResetEmail(auth, email);

  useEffect(() => {
    const unsubuscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log({ currentUser });
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubuscribe();
  }, []);

  return (
    <authContext.Provider
      value={{
        signup,
        login,
        user,
        logout,
        loading,
        loginWithGoogle,
        loginWithFacebook,
        resetPassword,
        sendsignlink,
        isSignEmail,
        signInWithEmail
      }}
    >
      {children}
    </authContext.Provider>
  );
}
