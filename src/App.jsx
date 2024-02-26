import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./screens/global/Topbar";
import Sidebar from "./screens/global/Sidebar";
import Dashboard from "./screens/dashboard";
import Team from "./screens/team";
import Contacts from "./screens/contacts";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import ClientRegistration from "./components/client/ClientRegistration";
import Cluster from "./screens/cluster";
import Devices from "./screens/device";
import AdminRegistration from "./components/admin/AdminRegistration";
import Admin from "./screens/admin";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/team/client" element={<ClientRegistration/>}/>
              <Route path="/admin" element={<Admin/>} />
              <Route path="/admin/reg" element={<AdminRegistration/>} />
              <Route path="/cluster" element={<Cluster/>} />
              <Route path="/devices" element={<Devices/> } />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
