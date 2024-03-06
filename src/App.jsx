import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Topbar from "./screens/global/Topbar";
import Sidebar from "./screens/global/Sidebar";
import Dashboard from "./screens/dashboard";
import Team from "./screens/team";
import Contacts from "./screens/contacts";
import ClientRegistration from "./components/client/ClientRegistration";
import Cluster from "./screens/cluster";
import Devices from "./screens/device";
import AdminRegistration from "./components/admin/AdminRegistration";
import Admin from "./screens/admin";
import Login from "./screens/login";
import RequireAuth from "./components/auth/RequireAuth";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();
  const showSidebarAndTopbar = location.pathname !== "/"; // Check if it's not the login page
 
  

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {showSidebarAndTopbar && <Sidebar isSidebar={isSidebar} />}

          <main className="content">
            {showSidebarAndTopbar && <Topbar setIsSidebar={setIsSidebar} />}
            <Routes>
              <Route path="/" element={<Login />} />

              {/* {Protected Routes} */}
              {/* <Route element={<RequireAuth allowedRoles={["Admin", "Client"]}  />}> */}
                <Route path="/dash" element={<Dashboard />} />
                <Route path="/team" element={<Team />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/team/client" element={<ClientRegistration />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/reg" element={<AdminRegistration />} />
                <Route path="/cluster" element={<Cluster />} />
                <Route path="/devices" element={<Devices />} />
              {/* </Route> */}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
