import axiosInstance from "../lib/axios";

interface LoginResponse {
  data: {
    token: string;
    user: {
      _id: string;
      // add other user fields as needed
      role: "hotelManager" | "routeManager" | "airlineOwner" | "admin"; // ADDED
    };
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

// Function to check if token is expired
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
};

export const login = async (credentials: LoginCredentials) => {
  try {
    const response = await axiosInstance.post<LoginResponse>(
      "/auth/login",
      credentials
    );
    console.log("Raw API response:", response);
    console.log("Response data:", response.data);

    // Check if the token exists in the response
    if (!response.data.data.token) {
      console.error("Response structure:", response.data);
      throw new Error("Invalid response format from server");
    }

    const token = response.data.data.token;
    const user = response.data.data.user; //ADDED

    // Store token expiration time
    const payload = JSON.parse(atob(token.split(".")[1]));
    localStorage.setItem("tokenExpiration", payload.exp.toString());

    // Store user data in localStorage
    localStorage.setItem("userData", JSON.stringify(user)); //ADDED

    return {
      token,
      // user: response.data.data.user,
      user, //ALTERED
    };
  } catch (error) {
    console.error("Auth service error:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("tokenExpiration");
  localStorage.removeItem("userData"); //ADDED

  // You might want to make an API call to invalidate the token on the server
  // await axiosInstance.post('/auth/logout');
};

//ADDED
// Add a function to get user data
export const getUserData = (): LoginResponse["data"]["user"] | null => {
  if (typeof window === "undefined") return null;
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
};

// Setup axios interceptor for handling 401 responses
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       // Clear auth data and redirect to login
//       logout();
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );
