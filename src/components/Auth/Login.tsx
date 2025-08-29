import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { login } from "../../services/authService";
import nature5 from "../../assets/nature5.jpg";
import {
  Box,
  Button,
  Stack,
  Input,
  Text,
  Flex,
  Container,
  IconButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { toaster } from "../ui/toaster";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { AxiosError } from "axios";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
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
        description: `Welcome back, ${response.user.firstName}!`,
        type: "success",
        duration: 3000,
        closable: true,
      });

      // Simply navigate to root and let RoleBasedRedirect handle the routing
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error instanceof AxiosError
          ? error.response?.data.errors
              .map((err: any) => err.msg)
              .join(`  ////  `)
          : "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // return (
  //   <Flex justifyContent="center" alignItems="center" h="100vh" w="100vw">
  //     <Box
  //       minW="md"
  //       minH="fit-content"
  //       mx="auto"
  //       p={6}
  //       borderWidth={1}
  //       borderRadius="lg"
  //       className="border-color card"
  //     >
  //       <Text fontSize="2xl" mb={6} textAlign="center">
  //         Login to Dashboard
  //       </Text>

  //       {error && (
  //         <Box mb={4} p={3} bg="red.50" color="red.600" borderRadius="md">
  //           <Text>{error}</Text>
  //         </Box>
  //       )}

  //       <form onSubmit={handleSubmit}>
  //         <Stack gap={4}>
  //           <Box>
  //             <Text mb={2}>Email</Text>
  //             <Input
  //               className="border-color"
  //               type="email"
  //               value={email}
  //               onChange={(e) => setEmail(e.target.value)}
  //               placeholder="Enter your email"
  //               required
  //             />
  //           </Box>

  //           <Box>
  //             <Text mb={2}>Password</Text>
  //             <Input
  //               className="border-color"
  //               type="password"
  //               value={password}
  //               onChange={(e) => setPassword(e.target.value)}
  //               placeholder="Enter your password"
  //               required
  //             />
  //           </Box>

  //           <Button
  //             type="submit"
  //             backgroundColor=""
  //             w="full"
  //             disabled={isLoading}
  //           >
  //             {isLoading ? "Logging in..." : "Login"}
  //           </Button>
  //         </Stack>
  //       </form>
  //     </Box>
  //   </Flex>
  // );

  return (
    <Container
      justifyContent="center"
      alignItems="end"
      maxW="full"
      centerContent
      minH="100vh"
      position="relative"
      overflow="hidden"
    >
      {/* Background Image Layer */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgImage={`url(${nature5})`}
        bgSize="cover"
        filter="brightness(0.8)"
        _dark={{
          filter: "brightness(0.6)",
        }}
        zIndex={0}
      />
      <Box
        position="absolute"
        top="32%"
        left="15%"
        right={0}
        bottom={0}
        zIndex={1}
      >
        <Text
          fontSize="6xl"
          fontWeight="bold"
          mb={4}
          color="rgb(218, 214, 214)"
          className="font-bebas-neue"
          letterSpacing="wide"
        >
          Travelux
        </Text>
        <Text
          fontSize="4xl"
          fontWeight="medium"
          color="rgb(218, 214, 214)"
          // className="font-oswald"
          className="font-bebas-neue"
          letterSpacing="wide"
        >
          Where Adventure Begins...
        </Text>
      </Box>
      <Flex
        mr={20}
        w="full"
        maxW="md"
        h="480px"
        bg="whiteAlpha.200"
        position="relative"
        zIndex={1}
        _dark={{
          bg: "blackAlpha.400",
        }}
        backdropFilter="blur(15px)"
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="xl"
        border="1px solid"
        borderColor="whiteAlpha.200"
      >
        {/* Left side - Airline Info */}

        <Box
          p={8}
          flex="1"
          minW="md"
          minH="fit-content"
          mx="auto"
          // className="border-color-login "
        >
          <Text
            fontSize="2xl"
            my={6}
            textAlign="center"
            className="font-oswald"
            letterSpacing="wide"
            color="whiteAlpha.700"
          >
            Login to Dashboard
          </Text>

          {error && (
            <Box mb={4} p={3} bg="red.50" color="red.600" borderRadius="md">
              <Text>{error}</Text>
            </Box>
          )}

          <form onSubmit={handleSubmit}>
            <Stack gap={6}>
              <Box>
                <Text mb={4} className="font-oswald" color="whiteAlpha.700">
                  Email
                </Text>
                <Input
                  className="border-color-login"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  color="whiteAlpha.700"
                  placeholder="Enter your email"
                  _placeholder={{ color: "whiteAlpha.700" }}
                  _dark={{
                    _placeholder: { color: "whiteAlpha.600" },
                    color: "whiteAlpha.600",
                  }}
                  required
                />
              </Box>

              <Box>
                <Text mb={4} className="font-oswald" color="whiteAlpha.700">
                  Password
                </Text>
                <Box position="relative">
                  <Input
                    className="border-color-login"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    color="whiteAlpha.700"
                    _placeholder={{ color: "whiteAlpha.700" }}
                    _dark={{
                      _placeholder: { color: "whiteAlpha.600" },
                      color: "whiteAlpha.600",
                    }}
                    pr="10"
                    required
                  />
                  <IconButton
                    position="absolute"
                    right="2"
                    top="50%"
                    transform="translateY(-50%)"
                    variant="ghost"
                    size="sm"
                    bgColor="transparent"
                    color="whiteAlpha.700"
                    _dark={{ color: "whiteAlpha.600" }}
                    _hover={{ bg: "transparent" }}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <LuEyeOff size={18} />
                    ) : (
                      <LuEye size={18} />
                    )}
                  </IconButton>
                </Box>
              </Box>

              <Button
                className="font-oswald trip-secondary-button-color"
                // color="whiteAlpha.700"
                // bgColor="#396b9c"
                type="submit"
                // backgroundColor=""
                w="full"
                disabled={isLoading}
                my={4}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </Stack>
          </form>
        </Box>

        {/* Right side - Airplane Image */}
        {/* <Box
          flex="1"
          p={8}
          backgroundImage={`url(${airplane2})`}
          backgroundSize="cover"
          backgroundPosition="center"
        /> */}
      </Flex>
    </Container>
  );
};
