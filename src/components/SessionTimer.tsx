import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { isTokenExpired } from "@/services/authService";

function SessionTimer() {
  const { token } = useAuth();
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!token) {
        console.log("No active session");
        return 0; // Return 0 to indicate no valid time remaining
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        const now = Date.now();
        const difference = expirationTime - now;

        if (difference <= 0 || isTokenExpired(token)) {
          console.log("Session expired");
          return 0;
        }

        // Calculate hours, minutes, and seconds
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Format and log the time string
        if (hours > 0) {
          console.log(`Session expires in: ${hours}h ${minutes}m`);
        } else if (minutes > 0) {
          console.log(`Session expires in: ${minutes}m ${seconds}s`);
        } else {
          console.log(`Session expires in: ${seconds}s`);
        }

        return difference; // Return remaining time in milliseconds
      } catch (error) {
        console.error("Error calculating time left:", error);
        return 0;
      }
    };

    const scheduleNextCheck = () => {
      // Clear existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      const remainingTime = calculateTimeLeft();

      // Determine next check interval based on remaining time
      let nextCheckInterval;
      if (remainingTime <= 0) {
        return; // Don't schedule next check if session is expired
      } else if (remainingTime <= 60 * 1000) {
        // Less than 1 minute
        nextCheckInterval = 10 * 1000; // Check every 10 seconds
      } else if (remainingTime <= 10 * 60 * 1000) {
        // Less than 10 minutes
        nextCheckInterval = 60 * 1000; // Check every minute
      } else if (remainingTime <= 60 * 60 * 1000) {
        // Less than 1 hour
        nextCheckInterval = 5 * 60 * 1000; // Check every 5 minutes
      } else {
        nextCheckInterval = 30 * 60 * 1000; // Check every 30 minutes
      }

      // Schedule next check
      timerRef.current = setTimeout(scheduleNextCheck, nextCheckInterval);
    };

    // Start checking
    scheduleNextCheck();

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [token]);

  return null; // Component doesn't render anything
}

export default SessionTimer;
