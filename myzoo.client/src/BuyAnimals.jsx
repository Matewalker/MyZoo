import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Card, CardMedia, CardContent, CardActions, Typography, Button, Box, LinearProgress, FormControl, InputLabel, Select, MenuItem, TextField } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "./UserContext";

function BuyAnimals() {
    const [animals, setAnimals] = useState([]);
    const [filteredAnimals, setFilteredAnimals] = useState([]);
    const [continents, setContinents] = useState([]);
    const [selectedContinent, setSelectedContinent] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { userData, setUserData } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("https://localhost:7174/api/zoo/continents") // Az API végpontot módosítani kell
            .then((res) => res.json())
            .then((data) => setContinents(data))
            .catch((error) => console.error("Continent fetch error: ", error));
    }, []);

    // Lekérjük az állatokat, szûrve a kiválasztott kontinens szerint
    useEffect(() => {
        setLoading(true);
        fetch(`https://localhost:7174/api/buy/get-animals?continent=${selectedContinent}`) // A backend API-tól függõen
            .then((res) => res.json())
            .then((data) => {
                setAnimals(data);
                setFilteredAnimals(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Animal fetch error: ", error);
                setLoading(false);
            });
    }, [selectedContinent]);

    useEffect(() => {
        fetch("https://localhost:7174/api/buy/get-animals", {
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                setAnimals(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Hiba az állatok lekérésekor:", error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const filtered = animals.filter((animal) =>
            animal.animalSpecies?.species.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredAnimals(filtered);
    }, [searchTerm, animals]);

    const buyAnimal = (id) => {
        fetch("https://localhost:7174/api/buy/buy-animal", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(id),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.succes == true) {
                    console.log("Elõzõ UserData:", userData);  // Elõzõ userData
                    setUserData(prev => {
                        console.log("Frissített UserData:", { ...prev, capital: data.capital });
                        return {
                            ...prev,
                            capital: data.capital
                        };
                    });
                }
            })
            .catch((error) => console.error("Hiba a vásárláskor:", error));
    };

    const handleNavigate = (animalId) => {
        navigate(`/animal-data/${animalId}`);
    };

    if (loading) return <LinearProgress value={38} />;

    return (
        <Container sx={{ paddingY: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h2" fontWeight="bold" align="center">
                    Animal Shop
                </Typography>
            </Box>

            <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="continent-select-label">Select Continent</InputLabel>
                <Select
                    labelId="continent-select-label"
                    value={selectedContinent}
                    label="Select Continent"
                    onChange={(e) => setSelectedContinent(e.target.value)}
                >
                    <MenuItem value="">All Continents</MenuItem>
                    {continents.map((continent) => (
                        <MenuItem key={continent.id} value={continent.name}>
                            {continent.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    label="Search by Animal Name"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Box>

            <Grid container spacing={3}>
                {filteredAnimals.map((animal) => (
                    <Grid item xs={12} sm={6} md={4} key={animal.id}>
                        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                            <CardMedia
                                component="img"
                                height="300"
                                image={animal.image}
                                alt={animal.animalSpecies?.species}
                                sx={{ objectFit: "cover" }}
                                onClick={() => handleNavigate(animal.id)}
                            />
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    {animal.animalSpecies?.species}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Sex: {animal.gender === 0 ? "Female" : animal.gender === 1 ? "Male" : "Baby"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Price: {animal.value}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    color="primary"
                                    onClick={() => buyAnimal(animal.id)}
                                >
                                    Buy
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default BuyAnimals;


