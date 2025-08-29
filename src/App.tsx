import AppRoutes from "./routes";
import SessionTimer from "./components/Navbar/SessionTimer";

import { ColorModeProvider } from "./components/ui/color-mode";
import { RoleBasedProvider } from "./contexts/RoleBasedProvider";
import { TranslationProvider } from "./contexts/TranslationContext";

function App() {
  return (
    <TranslationProvider>
      <ColorModeProvider>
        <RoleBasedProvider>
          <SessionTimer />
          <AppRoutes />
        </RoleBasedProvider>
      </ColorModeProvider>
    </TranslationProvider>
  );
}

export default App;
