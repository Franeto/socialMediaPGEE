import Home from "./pages/home/Home";
import "./app.css";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Messenger from "./pages/messenger/Messenger";

function App() {

  const {user}  = useContext(AuthContext)
  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate replace to={"/"}/> : <Login />} />
        <Route path="/register" element={user ? <Navigate replace to={"/"}/> : <Register />} />
        <Route path="/" element={user ? <Home /> : <Login />} />
        <Route path="/profile/:username" element={user ? <Profile /> : <Login />} />
        <Route path="/messenger" element={user ? <Messenger /> : <Login />} />
      </Routes>
    </Router>
  );
}

export default App;
