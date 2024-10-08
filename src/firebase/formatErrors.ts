export const getFriendlyErrorMessage = (errorCode: string) => {
  switch (errorCode) {
    case "auth/invalid-credential":
      return "Your email or password is incorrect. If you have previously signed up with Google, please try signing in with your Google account.";
    case "auth/user-disabled":
      return "This account has been disabled";
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/wrong-password":
      return "The password is incorrect. Please try again.";
    case "auth/internal-error":
      return "The authentication server encountered an unexpected error, please retry later.";
    case "auth/email-already-in-use":
      return "This email is already in use by another account.";
    case "firestore/permission-denied":
      return "You do not have the necessary permission to perform this action.";
    case "firestore/not-found":
      return "The requested document no longer exists.";
    case "firestore/unavailable":
      return "The Firestore service is currently unavailable. Try again later.";
    case "network-request-failed":
      return "Network connection failed. Check your Internet connection.";
    default:
      return `An error has occurred. Please try again. Error code: ${errorCode}`;
  }
};