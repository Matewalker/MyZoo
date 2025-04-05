import React, { useEffect, useState } from "react";
import { Container, Grid, Card, CardMedia, CardContent, CardActions, Typography, Button, Box, LinearProgress } from "@mui/material";

const AnimalZoo = () => {
    const [zooAnimals, setZooAnimals] = useState([]);
    const [ticketPrice, setTicketPrice] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://localhost:7174/api/zoo/get-zoo-animals", {
            method: "GET",
            credentials: "include",
        })
            .then(response => {
                console.log("HTTP válasz objektum:", response);
                return response.json();
            })
            .then(data => {
                console.log("API válasz JSON:", data);
                setZooAnimals(data.animals || []);
                setLoading(false);
            })
            .catch(error => console.error("Hiba történt:", error));
            setLoading(false);
    }, []);


    const removeFromZoo = async (id) => {
        try {
            const response = await fetch("https://localhost:7174/api/buy/remove-from-zoo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(id),
                credentials: "include",
            });

            const data = await response.json();
            if (response.ok) {
                setZooAnimals(zooAnimals.filter((animal) => animal.warehouseAnimalId !== id));
            } else {
                alert(data.message || "Hiba történt!");
            }
        } catch (error) {
            console.error("Hálózati hiba:", error);
            alert("Nem sikerült eltávolítani az állatot az állatkertbõl.");
        }

    };

    const decreaseTicketPrice = async () => {
        try {
            const response = await fetch("https://localhost:7174/api/zoo/set-ticket-prices", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(ticketPrice - 1),
                credentials: "include",
            });

            const data = await response.json();
            if (response.ok) {
                setTicketPrice(data.newPrice);
            } else {
                alert(data.message || "Hiba történt a jegyár frissítésekor.");
            }
        } catch (error) {
            console.error("Hálózati hiba:", error);
            alert("Nem sikerült frissíteni a jegyárat.");
        }
    }

    const increaseTicketPrice = async () => {
        try {
            const response = await fetch("https://localhost:7174/api/zoo/set-ticket-prices", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(ticketPrice + 1),
                credentials: "include",
            });

            const data = await response.json();
            if (response.ok) {
                setTicketPrice(data.newPrice);
            } else {
                alert(data.message || "Hiba történt a jegyár frissítésekor.");
            }
        } catch (error) {
            console.error("Hálózati hiba:", error);
            alert("Nem sikerült frissíteni a jegyárat.");
        }
    }    

    if (loading) return <LinearProgress value={38} />;

    return (
        <Container sx={{ paddingY: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h2" fontWeight="bold">
                    Zoo Animals
                </Typography>
                <Box>
                    <Typography variant="h6">Current Ticket Price: {ticketPrice}</Typography>
                    <Button variant="contained" color="primary" onClick={increaseTicketPrice}>
                        Increase Ticket Price
                    </Button>
                    <Button variant="contained" color="secondary" onClick={decreaseTicketPrice}>
                        Decrease Ticket Price
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {zooAnimals.length === 0 ? (
                    <Typography>No animals in the zoo.</Typography>
                ) : (
                    zooAnimals.map((animal) => (
                        <Grid item xs={12} sm={6} md={4} key={animal.warehouseAnimalId}>
                            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                <CardMedia
                                    component="img"
                                    height="300"
                                    image={animal.image}
                                    alt={animal.animalSpecies?.species}
                                    sx={{ objectFit: "cover" }}
                                />
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {animal.animalSpecies?.species}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Sex: {animal.gender === 0 ? "Female" : animal.gender === 1 ? "Male" : "Baby"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Reproduce: {animal.canReproduce === true ? "Can" : "Can't"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Remaining life: {animal.currentAge} months
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Attraction Rating: {animal.attractionRating}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        color="secondary"
                                        onClick={() => removeFromZoo(animal.warehouseAnimalId)}
                                    >
                                        Remove from Zoo
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
        </Container>
    );
};

export default AnimalZoo;