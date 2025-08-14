import AppRoutes from "./routes";
import SessionTimer from "./components/Navbar/SessionTimer";

import { ColorModeProvider } from "./components/ui/color-mode";
import { RoleBasedProvider } from "./contexts/RoleBasedProvider";

function App() {
  return (
    <ColorModeProvider>
      <RoleBasedProvider>
        <SessionTimer />
        <AppRoutes />
      </RoleBasedProvider>
    </ColorModeProvider>
  );
}

export default App;
