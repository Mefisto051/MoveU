import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; 
import CreatePlan from './pages/CreatePlan';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/create-plan" element={<CreatePlan />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
