import axiosInstance from "../lib/axios";

interface LoginResponse {
  data: {
    token: string;
    user: {
      _id: string;
      // add other user fields as needed
    };
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

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

    return {
      token: response.data.data.token,
      user: response.data.data.user,
    };
  } catch (error) {
    console.error("Auth service error:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("authToken");
  // You might want to make an API call to invalidate the token on the server
  // await axiosInstance.post('/auth/logout');
};
