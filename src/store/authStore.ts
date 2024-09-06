import { create } from "zustand";
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth"; // Assurez-vous d'importer createUserWithEmailAndPassword
import { auth } from "../firebase/firebase";
import { Status, Error } from "../utils/types";

type AuthState = {
  user: FirebaseUser | null;
  status: Status;
  error: Error;
};

type AuthAction = {
  createUser: (email: string, password: string, name: string) => void;
  logIn: (email: string, password: string) => void;
  logOut: () => void;
};

export const useAuthStore = create<AuthState & AuthAction>((set) => ({
  user: auth.currentUser,
  status: null,
  error: null,

  createUser: (email: string, password: string, name: string) => {
    set((state) => ({ ...state, status: "loading", error: null }));

    console.log(email, name, password)

    // Création de l'utilisateur avec email et mot de passe
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        return updateProfile(user, {
          displayName: name,
        }).then(() => {
          set({
            user: user,
            status: "success",
            error: null,
          });
        });
      })
      .catch((error) => {
        console.log(error)
        set((state) => ({...state, status: "error", error: error.message }));
      });
  },

  logIn: (email: string, password: string) => {
    set((state) => ({ ...state, status: "loading", error: null }));


    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        set({
          user: user,
          status: "success",
          error: null,
        });
      })
      .catch((error) => {
        set((state) => ({...state, status: "error", error: error.message }));

      });
  },

  logOut: () => {
    set((state) => ({ ...state, status: "loading", error: null }));
    signOut(auth)
      .then(() => {
        set({
          user: null,
          status: null,
          error: null,
        });
      })
      .catch((error) => {
        set((state) => ({...state, status: "error", error: error.message }));
      });
  },

}));
