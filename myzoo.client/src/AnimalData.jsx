import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Card, CardContent, CardMedia, LinearProgress } from "@mui/material";

function AnimalData() {
    const { id } = useParams();
    const [animalData, setAnimalData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`https://localhost:7174/api/animal/get-animal-data/${id}`, {
            method: "GET",
            credentials: "include",
        })
            .then((response) => response.json())
            .then(data => {
                setAnimalData(data);
            })
            .catch(error => {
                console.error("There was an error fetching the animal data!", error);
            });
    }, [id]);

    const handleBack = () => {
        navigate(-1);
    };

    if (!animalData) {
        return <LinearProgress value={38} color="success" />;
    }

    return (
        <Box sx={{ padding: 4 }}>
            <Card sx={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 400, margin: "auto", backgroundColor: "mediumseagreen" }}>
                <CardMedia component="img" sx={{ width: "100%", height: 400, objectFit: "cover" }} image={animalData.image} alt={animalData.species}/>

                <CardContent sx={{ width: "100%", color: "white" }}>
                    <Typography variant="h4" align="center">{animalData.species}</Typography>
                    <Typography variant="body1">Sex: {animalData.gender === 0 ? "Female" : animalData.gender === 1 ? "Male" : "Baby"}</Typography>
                    <Typography variant="body1">Life: {animalData.agePeriod / 12} years</Typography>
                    <Typography variant="body1">Value: {animalData.value}</Typography>
                    <Typography variant="body1">Attraction Rating: {animalData.attractionRating}</Typography>
                    <Typography variant="body1">Feeding Period: {animalData.feedingPeriod} / months</Typography>
                    <Typography variant="body1">Feed: {animalData.feed}</Typography>
                    <Typography variant="body1">Continents: {animalData.continents.join(", ")}</Typography>
                </CardContent>

                <Box sx={{ pb: 2 }}>
                    <Button variant="outlined" sx={{ color: "white", borderColor: "white" }} onClick={handleBack}>
                        Back
                    </Button>
                </Box>
            </Card>
        </Box>
    );
}

export default AnimalData;