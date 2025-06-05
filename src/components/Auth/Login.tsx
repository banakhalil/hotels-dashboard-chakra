import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { login } from "../../services/authService";
import { Box, Button, Stack, Input, Text } from "@chakra-ui/react";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await login({ email, password });
      console.log("Full login response:", response);

      if (!response || !response.token) {
        throw new Error("No token received from server");
      }

      setToken(response.token);
      console.log("Token after setting:", localStorage.getItem("authToken"));

      // Small delay to ensure token is set before reload
      setTimeout(() => {
        window.location.reload();
      }, 100);
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
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
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
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </Box>

          <Button
            type="submit"
            colorScheme="blue"
            w="full"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
