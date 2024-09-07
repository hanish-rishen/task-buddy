import { auth } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export const registerUser = async (email: string, password: string, name: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    return userCredential.user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    // You can access the Google user info here if needed
    // const user = result.user;
    return result;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};