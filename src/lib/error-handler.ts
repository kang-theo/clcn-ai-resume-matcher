import { toast } from "react-hot-toast";

// Return a user-friendly message
function getErrorMessage(error: any): string {
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 401:
        return "Unauthorized access. Please check your credentials and try again.";
      case 403:
        return "Forbidden. You do not have permission to perform this action.";
      case 404:
        return "Resource not found. Please check the URL or contact support.";
      case 500:
        return "Internal server error. We're working to fix it as soon as possible.";
      case 503:
        return "Service unavailable. Please try again later.";
      default:
        return (
          data.message || `Unexpected server error (status code: ${status}).`
        );
    }
  } else if (error.request) {
    return "Network error. Please check your internet connection and try again.";
  } else {
    return "An unexpected error occurred. Please try again later.";
  }
}

export function handleError(error: any) {
  const message = getErrorMessage(error);

  // Global error handling logic, eg:
  // - pop-up error notification
  // - log
  // - send error to monitor system
  toast(message, { position: "top-right" });
}
