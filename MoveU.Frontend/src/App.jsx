import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; 
import CreatePlan from './pages/CreatePlan';
import Profile from './pages/Profile'; // ✅ AGREGAR ESTA LÍNEA

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path="/create-plan" element={<CreatePlan />} />
          <Route path="/profile" element={<Profile />} /> {/* ✅ AGREGAR ESTA RUTA */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
