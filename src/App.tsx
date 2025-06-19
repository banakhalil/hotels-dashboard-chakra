import { ChakraProvider } from "@chakra-ui/react";
import AppRoutes from "./routes";
import SessionTimer from "./components/SessionTimer";
import system from "./theme";
import { ColorModeProvider } from "./components/ui/color-mode";

function App() {
  return (
    <ColorModeProvider>
      <SessionTimer />
      <AppRoutes />
    </ColorModeProvider>
  );
}

export default App;
