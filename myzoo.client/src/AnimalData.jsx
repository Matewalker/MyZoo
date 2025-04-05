import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Card, CardContent, CardMedia, LinearProgress } from '@mui/material';

function AnimalData() {
    const { id } = useParams();
    const [animalData, setAnimalData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`https://localhost:7174/api/zoo/get-animal-data/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
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
        return <LinearProgress value={38} />;
    }

    return (
        <Box sx={{ padding: 4 }}>
            <Card sx={{ display: "flex" }}>
                <CardMedia
                    component="img"
                    sx={{ width: "300" }}
                    image={animalData.image}
                    alt={animalData.species}
                />
                <Box sx={{ display: "flex", flexDirection: "column", padding: 2 }}>
                    <CardContent>
                        <Typography variant="h4">{animalData.species}</Typography>
                        <Typography variant="body1"><strong>Sex:</strong> {animalData.gender === 0 ? "Female" : animalData.gender === 1 ? "Male" : "Baby"}</Typography>
                        <Typography variant="body1"><strong>Life:</strong> {animalData.agePeriod/12} years</Typography>
                        <Typography variant="body1"><strong>Value:</strong> {animalData.value}</Typography>
                        <Typography variant="body1"><strong>Attraction Rating:</strong> {animalData.attractionRating}</Typography>
                        <Typography variant="body1"><strong>Feeding Period:</strong> {animalData.feedingPeriod} / months</Typography>
                        <Typography variant="body1"><strong>Feed:</strong> {animalData.feed}</Typography>
                        <Typography variant="body1"><strong>Continents:</strong> {animalData.continents.join(', ')}</Typography>
                    </CardContent>
                    <Button variant="outline" sx={{ color: "mediumseagreen" }} onClick={handleBack}>Back</Button>
                </Box>
            </Card>
        </Box>
    );
}

export default AnimalData;