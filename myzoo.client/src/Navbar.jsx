import React, { useState, useEffect, useContext } from "react";
import { Box, Button, Drawer, Typography, Menu, MenuItem, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { AnimalContext } from "./AnimalContext";
import AccountCircle from "@mui/icons-material/AccountCircle";

function Navbar() {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [anchorEl, setAnchorEl] = useState();
    const [currentUsername, setCurrentUserName] = useState();
    const [showModal, setShowModal] = useState(false);
    const { userData, setUserData } = useContext(UserContext);
    const { animalData, setAnimalData } = useContext(AnimalContext);
    const navigate = useNavigate();

    const openDropDown = Boolean(anchorEl);

    useEffect(() => {
        fetch("https://localhost:7174/api/user/get-username", {
            method: "GET",
            credentials: "include",
            headers: {
                'Content-Type': "application/json"
            }
        })
            .then((userResponse) => {
                if (!userResponse.ok) {
                    throw new Error("User is not logged in.");
                }
                return userResponse.json();
            })
            .then((usernameResult) => {
                const username = (usernameResult.username);
                setCurrentUserName(username);
                return fetch(`https://localhost:7174/api/menu/user-data/${username}`, {
                    credentials: "include",
                });
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error retrieving user data.");
                }
                return response.json();
            })
            .then((data) => {
                setUserData(data);
            })
            .catch((error) => {
                console.error(error);
            });

    }, [userData.currentDate]);

    const handleNextTurn = () => {
        fetch("https://localhost:7174/api/menu/next-turn", {
            method: "POST",
            credentials: "include",
        })
            .then((response) => {
                return response.json().then((result) => {
                    if (response.ok) {
                        setUserData({
                            ...userData,
                            currentDate: result.newDate,
                            capital: result.newCapital,
                            visitors: result.newVisitors,
                        });
                        const updatedAnimalData = animalData.map((animal) => {
                            const updatedAnimal = result.newZooAnimals.find(
                                (updated) => updated.id === animal.id
                            );
                            return updatedAnimal
                        });

                        setAnimalData(updatedAnimalData);
                    }
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleLogout = () => {
        fetch("https://localhost:7174/api/account/logout", {
            method: "POST",
            credentials: "include",
        })
            .then((response) => {
                return response.json().then(() => {
                    if (response.ok) {
                        setUserData({});
                        navigate("/login");
                    }
                });
            })
            .catch((error) => {
                console.error(error);
            });  
    };

    const handleResetGame = () => {
        fetch("https://localhost:7174/api/menu/reset-game", {
            method: "POST",
            credentials: "include"
        })
            .then((response) => {
                return response.json().then((result) => {
                    if (response.ok) {
                        setShowModal(false);
                        setUserData({
                            ...userData,
                            currentDate: result.newUserData.currentDate,
                            capital: result.newUserData.captial,
                            visitors: result.newUserData.visitors,
                        });
                        window.location.reload();
                    }
                });
            })
            .catch(error => console.error("Reset error: ", error));
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Box sx={{ display: "flex", padding: 2, justifyContent: "space-between", backgroundColor: "mediumseagreen", color: "white" }}>
                <Button variant="outlined" color="neutral" onClick={() => setOpenDrawer(true)}>
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

                <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }} aria-controls={open ? "account-menu" : undefined} aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}>
                    <AccountCircle />
                    <Typography>{currentUsername}</Typography>
                </IconButton>
                <Menu anchorEl={anchorEl} id="account-menu" open={openDropDown} onClose={handleClose} onClick={handleClose}
                    transformOrigin={{ horizontal: "right", vertical: "top" }} anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    <MenuItem onClick={() => setShowModal(true)}>Reset Game</MenuItem>
                </Menu>

                <Typography sx={{ fontWeight: "bold" }}>{userData.username}</Typography>
                <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} PaperProps={{
                    sx:{ width: 250, backgroundColor: "black" } }}>
                    <Box sx={{ width: 250 }}>
                        <Button sx={{ color: "mediumseagreen", fontSize: "1.2rem" }} fullWidth onClick={() => { setOpenDrawer(false); navigate("/zoo"); }}>
                            Zoo
                        </Button>
                        <Button sx={{ color: "mediumseagreen", fontSize: "1.2rem" }} fullWidth onClick={() => { setOpenDrawer(false); navigate("/animal-shop"); }}>
                            Buy Animals
                        </Button>
                        <Button sx={{ color: "mediumseagreen", fontSize: "1.2rem" }} fullWidth onClick={() => { setOpenDrawer(false); navigate("/animal-warehouse"); }}>
                            Animal warehouse
                        </Button>
                        <Button sx={{ color: "mediumseagreen", fontSize: "1.2rem" }} fullWidth onClick={() => { setOpenDrawer(false); navigate("/feeds"); }}>
                            Buy Feeds
                        </Button>
                        <Box sx={{ textAlign: "center", mt: 2 }}>
                            <img src="/zooLogo.png" alt="logo" style={{ width: 250, objectFit: "contain" }}/>
                        </Box>
                    </Box>
                </Drawer>
            </Box>
            <Dialog open={showModal} onClose={() => setShowModal(false)}>
                <DialogTitle>Reset Game</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to reset the game? All progress will be lost.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button onClick={handleResetGame} color="error">Reset</Button>
                </DialogActions>
            </Dialog>
        </> 
    );
}

export default Navbar;