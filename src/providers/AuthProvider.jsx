import { createContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import auth from "../firebase.config";
import PropTypes from 'prop-types'; // Use standard import

export const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    }

    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    }

    const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name, photoURL: photo
        });
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async currentUser => {
            setUser(currentUser);
            if (currentUser) {
                // Get token and store in localStorage
                const token = await currentUser.getIdToken();
                localStorage.setItem('access-token', token);

                // Sync user with backend
                try {
                    // We need to import axios or use fetch directly here to avoid circular dependency if api.js uses AuthContext (it doesn't yet, but good practice)
                    // But since api.js is simple, we can use it, or just use fetch for this critical step.
                    // Let's use fetch for zero-dependency in this file for now or import api if we want to be consistent.
                    // Given api.js is already set up with interceptors, let's use it.
                    // ERROR: api.js uses interceptors that rely on localStorage. We just set it.
                    // Ideally we should import api from '../utils/api'.

                    // Dynamic import or request to prevent issues? checking imports...
                 

                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
                    const response = await fetch(`${apiUrl}/api/users/sync`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            name: currentUser.displayName,
                            email: currentUser.email,
                            photoURL: currentUser.photoURL
                        })
                    });

                    const data = await response.json();
                    console.log('User synced:', data);

                    // Merge backend data (role, etc) into the firebase user object
                    currentUser.role = data.role;
                    // Trigger a re-render with the updated user object
                    setUser({ ...currentUser });

                } catch (error) {
                    console.error('Failed to sync user', error);
                }
            } else {
                localStorage.removeItem('access-token');
            }
            setLoading(false);
        });
        return () => {
            return unsubscribe();
        }
    }, [])

    const authInfo = {
        user,
        loading,
        createUser,
        signIn,
        googleSignIn,
        logOut,
        updateUserProfile
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node,
};

export default AuthProvider;
