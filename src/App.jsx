import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AdherentForm from "./pages/AdherentForm";
import PartenaireForm from "./pages/PartenaireForm";
import NonAdherentForm from "./pages/NonAdherentForm";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const authState = localStorage.getItem("isAuthenticated");
    if (authState === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    navigate("/");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCreateAccount = (username, password) => {
    
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {isAuthenticated && location.pathname !== "/login" && <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />}
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/create-account" element={<CreateAccount onCreateAccount={handleCreateAccount} />} />
        <Route path="/" element={isAuthenticated ? <Home /> : <Login onLogin={handleLogin} />} />
        <Route path="/adherent" element={isAuthenticated ? <AdherentForm /> : <Login onLogin={handleLogin} />} />
        <Route path="/visiteur" element={isAuthenticated ? <NonAdherentForm /> : <Login onLogin={handleLogin} />} />
        <Route path="/partenaire" element={isAuthenticated ? <PartenaireForm /> : <Login onLogin={handleLogin} />} />
      </Routes>
    </div>
  );
}
