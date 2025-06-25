import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { login } from "../../services/authService";
import { Box, Button, Stack, Input, Text, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { toaster } from "../ui/toaster";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const { setToken } = useAuth();
  const { setAuthData } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await login({ email, password });
      console.log("Full login response:", response);

      if (!response || !response.token || !response.user) {
        throw new Error("No token received from server");
      }

      // setToken(response.token);
      setAuthData(response.token, response.user);
      console.log("Token after setting:", localStorage.getItem("authToken"));

      toaster.create({
        title: "Success",
        description: `Welcome back, ${response.user.role}!`,
        type: "success",
        duration: 3000,
        closable: true,
      });
      // Navigate to dashboard instead of reloading
      // navigate("/");

      // Redirect based on user role
      switch (response.user.role) {
        case "hotelManager":
          navigate("/hotel");
          break;
        case "routeManager":
          navigate("/train");
          break;
        case "airlineOwner":
          navigate("/airline");
          break;
        case "admin":
          navigate("/admin");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex justifyContent="center" alignItems="center" h="100vh" w="100vw">
      <Box
        minW="md"
        minH="fit-content"
        mx="auto"
        p={6}
        borderWidth={1}
        borderRadius="lg"
        className="border-color card"
      >
        <Text fontSize="2xl" mb={6} textAlign="center">
          Login to Dashboard
        </Text>

        {error && (
          <Box mb={4} p={3} bg="red.50" color="red.600" borderRadius="md">
            <Text>{error}</Text>
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <Stack gap={4}>
            <Box>
              <Text mb={2}>Email</Text>
              <Input
                className="border-color"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </Box>

            <Box>
              <Text mb={2}>Password</Text>
              <Input
                className="border-color"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </Box>

            <Button
              type="submit"
              backgroundColor=""
              w="full"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
};
