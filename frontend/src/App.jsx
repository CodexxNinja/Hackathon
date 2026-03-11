import { Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import VisitorForm from "./pages/VisitorForm";

function LoginWrapper() {
  const navigate = useNavigate();
  
  const handleLogin = (isAdmin) => {
    if (isAdmin) {
      navigate("/admin");
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
      </Routes>
    </Router>
  );
}

export default App;

