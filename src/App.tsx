import { ChakraProvider } from "@chakra-ui/react";
import AppRoutes from "./routes";
import SessionTimer from "./components/SessionTimer";
import system from "./theme";
import { ColorModeProvider } from "./components/ui/color-mode";
import { StationsProvider } from "./contexts/StationsContext";
import { TrainsProvider } from "./contexts/TrainsContext";
import { RoutesProvider } from "./contexts/RoutesContext";

function App() {
  return (
    <ColorModeProvider>
      <RoutesProvider>
        <StationsProvider>
          <TrainsProvider>
            <SessionTimer />
            <AppRoutes />
          </TrainsProvider>
        </StationsProvider>
      </RoutesProvider>
    </ColorModeProvider>
  );
}

export default App;
