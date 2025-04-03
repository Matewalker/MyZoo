import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import StartPage from "./StartPage";
import Register from "./Register";
import Login from "./Login";
import MainPage from "./MainPage";
import BuyAnimals from "./BuyAnimals";
import AnimalWarehouse from "./AnimalWarehouse";
import Zoo from "./Zoo";
import FeedCollection from "./FeedCollection";
import Navbar from "./Navbar";
import "./App.css";

function App() {
    return (
        <Router>
            <NavbarWithConditionalRender />
            <Routes>
                <Route path="/" element={<StartPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/user-data" element={<MainPage />} />
                <Route path="/animal-shop" element={<BuyAnimals />} />
                <Route path="/animal-warehouse" element={<AnimalWarehouse />} />
                <Route path="/zoo" element={<Zoo />} />
                <Route path="/feeds" element={<FeedCollection />} />
            </Routes>
        </Router>
    );
}

function NavbarWithConditionalRender() {
    const location = useLocation();

    if (location.pathname === "/" || location.pathname === "/register" || location.pathname === "/login") {
        return null;
    }

    return <Navbar />;
}

export default App;