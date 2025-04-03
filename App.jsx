import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./StartPage";
import Register from "./Register";
import Login from "./Login";
import MainPage from "./MainPage";
import BuyAnimals from "./BuyAnimals";
import AnimalWarehouse from "./AnimalWarehouse";
import Zoo from "./Zoo";
import './App.css';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<StartPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/user-data" element={<MainPage />} />
                <Route path="/animal-shop" element={<BuyAnimals />} />
                <Route path="/animal-warehouse" element={<AnimalWarehouse />} />
                <Route path="/zoo" element={<Zoo />} />
            </Routes>
        </Router>
    );
}

export default App;