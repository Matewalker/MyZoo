import React, { useState, useEffect } from "react";
import { Box, Button, DialogContent, DialogTitle, Drawer, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MessageBox from "./MessageBox";
import { useContext } from "react";
import { UserContext } from "./UserContext";


function Navbar() {
    const [open, setOpen] = useState(false);
    const { userData, setUserData } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await fetch("https://localhost:7174/api/user/get-username", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        'Content-Type': "application/json"
                    }
                });

                if (!userResponse.ok) {
                    throw new Error("Felhasználó nincs bejelentkezve.");
                }

                const usernameResult = await userResponse.json();
                const username = usernameResult.username;

                const response = await fetch(`https://localhost:7174/api/menu/user-data/${username}`, {
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Hiba a felhasználói adatok lekérése közben");
                }

                const data = await response.json();
                setUserData(data);  // Frissítjük az adatokat

                const messagesResponse = await fetch("https://localhost:7174/api/menu/get-messages", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        'Content-Type': "application/json"
                    }
                });

                if (messagesResponse.ok) {
                    const messagesData = await messagesResponse.json();
                    setMessages(messagesData.messages || []);
                } else {
                    console.error("Hiba történt az üzenetek lekérésekor.");
                }

            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [userData.currentDate]);

    const handleNextTurn = async () => {
        try {
            const response = await fetch("https://localhost:7174/api/menu/next-turn", {
                method: "POST",
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Hiba a következõ kör feldolgozása közben");
            }
            const data = await response.json();
            setUserData({
                ...userData,
                currentDate: data.newDate,
                capital: data.newCapital,
                visitors: data.newVisitors,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", backgroundColor: "mediumseagreen", color: "white" }}>
                <Button variant="outlined" color="neutral" onClick={() => setOpen(true)}>
                    Menu
                </Button>
                <Box sx={{ display: "flex", gap: 3 }}>
                    <Box sx={{ display: "flex", flexDirection: "column" }} >
                        <Typography>Date: {userData.currentDate}</Typography>
                        <Button size="small" variant="outlined" color="neutral" onClick={handleNextTurn}>Next month</Button>
                    </Box>
                    <Typography>Capital: {userData.capital}</Typography>
                    <Typography>Visitors: {userData.visitors}</Typography>
                </Box>

                <Typography sx={{ fontWeight: "bold" }}>{userData.username}</Typography>
                <Drawer open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: 250, backgroundImage: 'url("/drawerBg.png")', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' } }}>
                    <Box sx={{ width: 250 }}>
                        <Button sx={{ color: "mediumseagreen", fontSize: "1.1rem" }} fullWidth onClick={() => { setOpen(false); navigate("/zoo"); }}>
                            Zoo
                        </Button>
                        <Button sx={{ color: "mediumseagreen", fontSize: "1.1rem" }} fullWidth onClick={() => { setOpen(false); navigate("/animal-shop"); }}>
                            Buy Animals
                        </Button>
                        <Button sx={{ color: "mediumseagreen", fontSize: "1.1rem" }} fullWidth onClick={() => { setOpen(false); navigate("/animal-warehouse"); }}>
                            Animal warehouse
                        </Button>
                        <Button sx={{ color: "mediumseagreen", fontSize: "1.1rem" }} fullWidth onClick={() => { setOpen(false); navigate("/feeds"); }}>
                            Buy Feeds
                        </Button>
                    </Box>
                </Drawer>
            </Box>
            <Box sx={{ display: "flex", backgroundColor: "mediumseagreen", color: "white" }}>
                <MessageBox messages={messages} />
            </Box>
        </Box>
    );
}

export default Navbar;