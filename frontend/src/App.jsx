import { Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";

function LoginWrapper() {
  const navigate = useNavigate();
  
  const handleLogin = (isAdmin) => {
    // In a real app, you'd handle authentication here
    if (isAdmin) {
      navigate("/admin");
    } else {
      // User login - redirect to user dashboard or visitor page
      alert("User login successful! (User dashboard coming soon)");
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
      </Routes>
    </Router>
  );
}

export default App;

