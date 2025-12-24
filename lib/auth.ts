import { signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
 } from "firebase/auth";
import { auth } from "./firebase";

export const login = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
export const register = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);
export const logOut = () => signOut(auth);

