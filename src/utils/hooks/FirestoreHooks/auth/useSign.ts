import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authenticateUser } from "./authenticateUser";
import { AuthService } from "@/utils/firebase/auth/authService";

/**
 * Custom hook to handle user sign-in and sign-up.
 * Uses `useMutation` from React Query to manage the authentication process.
 *
 * @returns  React Query's mutation result object containing `mutate` and other mutation states.
 */
export const useSign = () => {
    const navigate = useNavigate();
  
    return useMutation({
      mutationFn: authenticateUser,
      onSuccess: () => {
        navigate("/");  // Navigate to the home page upon successful authentication
      },
      onError: (error) => {
        console.error("Error while signing in:", error);
      },
    });
};


export const useSignWithGoogle = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: AuthService.signInWithGoogle,
    onSuccess: () => {
      navigate("/")
    }, 
    onError: (error) => {
      console.error("Error while signing in:", error);
    },
  })
}
  