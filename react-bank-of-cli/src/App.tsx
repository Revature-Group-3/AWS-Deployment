import "./App.css";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Transaction from "./pages/Transaction/Transaction";
import Recent from "./pages/History/History";
import Settings from "./pages/Settings/Settings";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import { useAuth } from "./context/AuthContext";
import { Toaster } from "@/components/ui/toast"

function App() {
  const { isLoggedIn } = useAuth();
  return (
    <>
      <BrowserRouter>
        {isLoggedIn && <NavBar />}
        <Routes>
          <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/" element={isLoggedIn ? <Dashboard /> : <Login />}></Route>
          <Route path="/transaction/:chosenType?" element={isLoggedIn ? <Transaction /> : <Login />}></Route>
          <Route path="/history" element={isLoggedIn ? <Recent /> : <Login />}></Route>
          <Route path="/settings" element={isLoggedIn ? <Settings /> : <Login />}></Route>
        </Routes>
      </BrowserRouter>
      <Toaster/>
    </>
  );
}

export default App;
