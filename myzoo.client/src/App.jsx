import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./StartPage";
import Register from "./Register";
import Login from "./Login";
import MainPage from "./MainPage";
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<StartPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/user-data" element={<MainPage />} />
            </Routes>
        </Router>
    );
}

export default App;