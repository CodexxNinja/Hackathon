import { Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import VerificationPage from "./pages/Verificationpage";
import VisitorForm from "./pages/VisitorForm";

function LoginWrapper() {
  const navigate = useNavigate();
  
  const handleLogin = (role) => {
    if (role === "admin") {
      navigate("/admin");
    } else if (role === "secure") {
      navigate("/verification");
    } else {
      navigate("/visitor");
    }
  };

  return <LoginPage onLogin={handleLogin} />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginWrapper />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/visitor" element={<VisitorForm />} />
        <Route path="/verification" element={<VerificationPage />} />
      </Routes>
    </Router>
  );
}

export default App;


