import React, { useState, useEffect } from "react";
import { Box, Button, DialogContent, DialogTitle, Drawer, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";


function Navbar() {
    const [open, setOpen] = useState(false);
    const [userData, setUserData] = useState({
        currentDate: "",
        capital: 0,
        visitors: 0,
        username: ""
    });
    const [messages, setMessages] = useState([]);  // Üzenetek állapota
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

                const userData = await userResponse.json();
                const username = userData.username;

                const response = await fetch(`https://localhost:7174/api/menu/user-data/${username}`, {
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Hiba a felhasználói adatok lekérése közben");
                }

                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error(error);
            }
        };

        const loadMessages = () => {
            const messages = sessionStorage.getItem("Messages");
            if (messages) {
                setMessages(JSON.parse(messages));
            }
        };

        fetchData();
        loadMessages();
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch("https://localhost:7174/api/menu/message", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        'Content-Type': "application/json"
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setMessages(data.messages || []);  // A válaszból beállítjuk az üzeneteket
                } else {
                    console.error("Hiba történt az üzenetek lekérésekor.");
                }
            } catch (error) {
                console.error("Hálózati hiba:", error);
            }
        };

        fetchMessages();
    }, []);

    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", padding: 2, backgroundColor: "#3f51b5", color: "white" }}>
            <Button variant="outlined" color="neutral" onClick={() => setOpen(true)}>
                Menu
            </Button>
            <Box sx={{ display: "flex", gap: 3 }}>
                <Typography>Date: {userData.currentDate}</Typography>
                <Typography>Capital: ${userData.capital}</Typography>
                <Typography>Visitors: {userData.visitors}</Typography>
            </Box>
            {messages.length > 0 && (
                <Box sx={{ position: 'absolute', top: 50, right: 20, backgroundColor: 'white', borderRadius: 2, padding: 2, boxShadow: 2 }}>
                    <Typography variant="h6">Messages:</Typography>
                    <List>
                        {messages.map((message, index) => (
                            <ListItem key={index}>{message}</ListItem>
                        ))}
                    </List>
                </Box>
            )}
            <Typography sx={{ fontWeight: "bold" }}>{userData.username}</Typography>
            <Drawer open={open} onClose={() => setOpen(false)}>
                <Box sx={{ width: 250, padding: 2 }}>
                    <Button fullWidth onClick={() => { setOpen(false); navigate("/zoo"); }}>
                        Zoo
                    </Button>
                    <Button fullWidth onClick={() => { setOpen(false); navigate("/animal-shop"); }}>
                        Buy Animals
                    </Button>
                    <Button fullWidth onClick={() => { setOpen(false); navigate("/animal-warehouse"); }}>
                        Animal warehouse
                    </Button>
                    <Button fullWidth onClick={() => { setOpen(false); navigate("/feeds"); }}>
                        Feed collection
                    </Button>
                </Box>
            </Drawer>
        </Box>
    );
}

export default Navbar;