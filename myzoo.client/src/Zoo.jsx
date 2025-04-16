import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import MessageBox from "./MessageBox";
import { Container, Grid, Card, CardMedia, CardContent, CardActions, Typography, Button, Box, LinearProgress, Tooltip, Snackbar, Alert, TextField } from "@mui/material";
import { AnimalContext } from "./AnimalContext";

const Zoo = () => {
    const [zooAnimals, setZooAnimals] = useState([]);
    const [filteredAnimals, setFilteredAnimals] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [ticketPrice, setTicketPrice] = useState(0);
    const [messages, setMessages] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const { animalData, setAnimalData } = useContext(AnimalContext);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("https://localhost:7174/api/zoo/get-zoo-animals", {
            method: "GET",
            credentials: "include",
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                setZooAnimals(data.animals || []);
                setTicketPrice(data.ticketPrice || 0);
                setLoading(false);
                setAnimalData(data.animals.map(animal => ({
                    id: animal.warehouseAnimalId,
                    currentAge: animal.currentAge,
                    canReproduce: animal.canReproduce
                })));
            })
            .catch(error => console.error("An error occurred: ", error));

        const messagesResponse = () => {
            fetch("https://localhost:7174/api/menu/get-messages", {
                method: "GET",
                credentials: "include",
                headers: {
                    'Content-Type': "application/json"
                }
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Failed to fetch messages");
                    }
                })
                .then(messagesData => {
                    setMessages(messagesData.messages);
                })
                .catch(error => {
                    console.error("Error occurred while fetching messages:", error);
                });
        };

        messagesResponse();
    }, []);

    useEffect(() => {
        const filtered = zooAnimals.filter((animal) =>
            animal.animalSpecies?.species.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredAnimals(filtered);
    }, [searchTerm, zooAnimals]);

    const removeFromZoo = async (id) => {
        fetch("https://localhost:7174/api/buy/remove-from-zoo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(id),
                credentials: "include",
        })
            .then((response) => {
                return response.json().then((result) => {
                    if (response.ok) {
                        setZooAnimals(zooAnimals.filter((animal) => animal.warehouseAnimalId !== id));
                        showSnackbar(result.message);
                    } else {
                        showSnackbar(result.message || "An error occurred!");
                    }
                });
            })
            .catch((error) => {
                console.error("Network error: ", error);
                showSnackbar("The animal could not be removed from the zoo.");
            });
    };

    const increaseTicketPrice = () => {
        setTicketPrice(prev => (prev < 30 ? prev + 1 : 30));
    };

    const decreaseTicketPrice = () => {
        setTicketPrice(prev => (prev > 0 ? prev - 1 : 0));
    };

    const saveTicketPrice = () => {
        fetch("https://localhost:7174/api/zoo/set-ticket-prices", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(ticketPrice),
            credentials: "include",
        })
            .then((response) => {
                return response.json().then((result) => {
                    if (response.ok) {
                        setTicketPrice(result.newPrice);
                        showSnackbar(result.message);
                    } else {
                        showSnackbar("An error occurred while updating the ticket price.");
                    }
                });
            })
            .catch((error) => {
                console.error("Network error: ", error);
                showSnackbar("Failed to update ticket price.");
            });
    };

    const handleNavigate = (animalId) => {
        navigate(`/animal-data/${animalId}`);
    };

    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    if (loading) return <LinearProgress value={38} color="success"/>;

    return (
        <>
            <Container sx={{ paddingY: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Box>
                        <Typography variant="h6" sx={{ mb: 1, color: "white" }}>
                            Ticket Price: {ticketPrice}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Button variant="contained" onClick={decreaseTicketPrice} sx={{ backgroundColor: "#297a4d" }}>
                                -
                            </Button>
                            <Button variant="contained" onClick={increaseTicketPrice} sx={{ backgroundColor: "#297a4d" }}>
                                +
                            </Button>
                            <Button variant="contained" color="success" onClick={saveTicketPrice}>
                                Save Price
                            </Button>
                        </Box>
                    </Box>
                    <Typography variant="h1" fontWeight="bold" sx={{ color: "#102e1d" }}>
                        Zoo
                    </Typography>
                    <MessageBox messages={messages} sx={{ alignSelf: { xs: "flex-end", md: "auto" }, width: { xs: "100%", md: "34%" } }}/>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <TextField fullWidth label="Search by Animal Name" value={searchTerm} sx={{ backgroundColor: "mediumseagreen" }}
                        onChange={(e) => setSearchTerm(e.target.value)}/>
                </Box>

                <Grid container spacing={3} justifyContent="center">
                    {zooAnimals.length === 0 ? (
                        <Typography>No animals in the zoo.</Typography>
                    ) : (
                        filteredAnimals.filter(animal => {
                            const details = animalData.find(data => data?.id === animal.warehouseAnimalId);
                            return details && details.currentAge >= 0; })
                        .map(animal => {
                            const animalDetails = animalData.find(data => data?.id === animal.warehouseAnimalId);

                            return (
                                <Grid item xs={12} sm={6} md={4} key={animal.warehouseAnimalId}>
                                    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "mediumseagreen", color: "white" }}>
                                        <Tooltip title="Click to see more">
                                            <CardMedia component="img" height="300" image={animal.image} alt={animal.animalSpecies?.species}
                                                sx={{ objectFit: "cover", cursor: "pointer" }} onClick={() => handleNavigate(animal.animalId)}/>
                                        </Tooltip>
                                        <CardContent>
                                            <Typography variant="h6" component="div">
                                                {animal.animalSpecies?.species}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Sex: {animal.gender === 0 ? "Female" : animal.gender === 1 ? "Male" : "Baby"}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Reproduce: {animalDetails?.canReproduce ? "Can" : "Can't"}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Remaining life: {animalDetails?.currentAge ?? "Unknown"} months
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Attraction Rating: {animal.attractionRating}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button variant="contained" fullWidth sx={{ color: "#297a4d", backgroundColor: "white" }}
                                                onClick={() => removeFromZoo(animal.warehouseAnimalId)}>
                                                Remove from Zoo
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            );
                        })
                    )}
                </Grid>
            </Container>

            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                <Alert severity="info" onClose={() => setSnackbarOpen(false)} sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Zoo;