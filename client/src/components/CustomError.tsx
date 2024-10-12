import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner"; // Assuming you have the `sooner-toast` package
import Loading from "@/components/Loading"; // Adjust the path if necessary

const ErrorBoundary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect to the page they clicked from or a default page
    const redirectTo = location.state?.from || "/";

    // Show toast notification for error
    toast.error("Invalid Inputs, redirecting you back to the previous page...");

    // Set loading to true to display the loading animation
    setIsLoading(true);

    // Perform the redirection after showing toast
    const timeoutId = setTimeout(() => {
      setIsLoading(false); // Hide loading animation
      navigate(redirectTo); // Navigate to the previous page or home
    }, 1000); // Adjust the timeout duration if needed

    // Cleanup the timeout on unmount
    return () => clearTimeout(timeoutId);
  }, [navigate, location]);

  // Display loading animation while redirecting
  if (isLoading) {
    return <Loading />;
  }

  return null; // Do not display any error page UI
};

export default ErrorBoundary;
