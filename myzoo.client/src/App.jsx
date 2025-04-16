import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Box, GlobalStyles } from "@mui/material";
import StartPage from "./StartPage";
import Register from "./Register";
import Login from "./Login";
import BuyAnimals from "./BuyAnimals";
import AnimalWarehouse from "./AnimalWarehouse";
import Zoo from "./Zoo";
import FeedCollection from "./FeedCollection";
import Navbar from "./Navbar";
import AnimalData from "./AnimalData";
import { useContext } from "react";
import { UserContext } from "./UserContext";

function App() {
    return (
        <>
            <GlobalStyles styles={{
                html: { margin: 0, padding: 0, height: "100%" },
                body: { margin: 0, padding: 0, height: "100%" },
                "#root": { height: "100%" }
            }} />

            <Box sx={{
                backgroundImage: "url('startBg.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", minHeight: "100vh",
                backgroundAttachment: "fixed",
            }}>
                <Router>
                    <NavbarWithConditionalRender />
                    <Routes>
                        <Route path="/" element={<StartPage />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/animal-shop" element={<BuyAnimals />} />
                        <Route path="/animal-warehouse" element={<AnimalWarehouse />} />
                        <Route path="/zoo" element={<Zoo />} />
                        <Route path="/feeds" element={<FeedCollection />} />
                        <Route path="/animal-data/:id" element={<AnimalData />} />
                    </Routes>
                </Router>
            </Box>  
        </>
    );
}

function NavbarWithConditionalRender() {

    const { userData } = useContext(UserContext);
    const location = useLocation();

    if (location.pathname === "/" || location.pathname === "/register" || location.pathname === "/login") {
        return null;
    }

    return <Navbar key={userData.capital} />;
}

export default App;