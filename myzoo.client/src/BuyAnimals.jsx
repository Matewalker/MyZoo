import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Card, CardMedia, CardContent, CardActions, Typography, Button, Box, LinearProgress, FormControl, Snackbar, Alert,
    InputLabel, Select, MenuItem, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip } from "@mui/material";
import PaginationControls from "./PaginationControls";
import { UserContext } from "./UserContext";

function BuyAnimals() {
    const [animals, setAnimals] = useState([]);
    const [filteredAnimals, setFilteredAnimals] = useState([]);
    const [continents, setContinents] = useState([]);
    const [selectedContinent, setSelectedContinent] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedAnimalId, setSelectedAnimalId] = useState(null);
    const { setUserData } = useContext(UserContext);
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const animalsPerPage = 30;

    const lastAnimal = currentPage * animalsPerPage;
    const firstAnimal = lastAnimal - animalsPerPage;
    const currentAnimals = filteredAnimals.slice(firstAnimal, lastAnimal);
    const totalPages = Math.ceil(filteredAnimals.length / animalsPerPage);

    useEffect(() => {
        fetch("https://localhost:7174/api/continent/get-continents")
            .then((response) => {
                return response.json().then((result) => {
                    if (response.ok) {
                        setContinents(result);
                    }
                });
            })
            .catch((error) => console.error("Continent fetch error: ", error));
    }, []); 

    useEffect(() => {
        setLoading(true);
        fetch(`https://localhost:7174/api/animal/get-animals?continent=${selectedContinent}`)
            .then((response) => {
                return response.json().then((result) => {
                    if (response.ok) {
                        setAnimals(result);
                        setFilteredAnimals(result);
                        setLoading(false);
                    }
                });
            })
            .catch((error) => {
                console.error("Animal fetch error: ", error);
                setLoading(false);
            });
            
    }, [selectedContinent]);

    useEffect(() => {
        fetch("https://localhost:7174/api/animal/get-animals", {
            credentials: "include",
        })
            .then((response) => {
                return response.json().then((result) => {
                    if (response.ok) {
                        setAnimals(result);
                        setLoading(false);
                    }
                });
            })
            .catch((error) => {
                console.error("Error retrieving animals:", error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const filtered = animals.filter((animal) =>
            animal.animalSpecies?.species.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredAnimals(filtered);
        setCurrentPage(1);
    }, [searchTerm, animals]);

    const buyAnimal = () => {
        if (!selectedAnimalId) return;

        fetch("https://localhost:7174/api/buy/buy-animal", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(selectedAnimalId),
        })
            .then((response) => {
                return response.json().then((result) => {
                    if (response.ok) {
                        showSnackbar(result.message);
                        setUserData(prev => ({
                            ...prev,
                            capital: result.capital
                        }));
                        setShowModal(false);
                    }
                });
            })
            .catch((error) => {
                console.error("Error when purchasing:", error);
                showSnackbar("The animal could not be purchased.");
            });
    };

    const handleNavigate = (animalId) => {
        navigate(`/animal-data/${animalId}`);
    };

    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    if (loading) return <LinearProgress value={38} color="success" />;

    return (
        <>
            <Container sx={{ paddingY: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h2" fontWeight="bold" align="center" sx={{ color: "#102e1d" }}>
                        Animal Shop
                    </Typography>
                </Box>

                <FormControl fullWidth sx={{ backgroundColor: "mediumseagreen", mb: 3 }}>
                    <InputLabel id="continent-select-label">Select Continent</InputLabel>
                    <Select labelId="continent-select-label" value={selectedContinent} label="Select Continent"
                        onChange={(e) => setSelectedContinent(e.target.value)}>
                        <MenuItem value="">All Continents</MenuItem>
                        {continents.map((continent) => (
                            <MenuItem key={continent.id} value={continent.name}>
                                {continent.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Box sx={{ mb: 3 }}>
                    <TextField fullWidth label="Search by Animal Name" variant="outlined" value={searchTerm} sx={{ backgroundColor: "mediumseagreen" }}
                        onChange={(e) => setSearchTerm(e.target.value)} />
                </Box>

                <Grid container spacing={3} justifyContent="center">
                    {currentAnimals.map((animal) => (
                        <Grid item xs={12} sm={6} md={4} key={animal.id}>
                            <Card sx={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "mediumseagreen", color: "white" }}>
                                <Tooltip title="Click to see more">
                                    <CardMedia component="img" height="300" image={animal.image} alt={animal.animalSpecies?.species}
                                        sx={{ objectFit: "cover", cursor: "pointer" }} onClick={() => handleNavigate(animal.id)} />
                                </Tooltip>
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
                                    <Button variant="contained" fullWidth sx={{ backgroundColor: "#297a4d" }}
                                        onClick={() => { setSelectedAnimalId(animal.id); setShowModal(true); }}>
                                        Buy
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </Container>

            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                <Alert onClose={() => setSnackbarOpen(false)} sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Dialog open={showModal} onClose={() => setShowModal(false)}>
                <Box sx={{ backgroundColor: "mediumseagreen", color: "white" }}>
                    <DialogTitle>Buy Animal</DialogTitle>
                    <DialogContent>
                        Are you sure you want to buy this animal?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowModal(false)} variant="outlined" sx={{ color: "white", borderColor: "white"}}>
                            Cancel
                        </Button>
                        <Button onClick={buyAnimal} variant="contained" autoFocus sx={{ backgroundColor: "#297a4d" }}>
                            Buy
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    );
}

export default BuyAnimals;