import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, CardMedia, Typography, Grid, Snackbar, Alert, Switch, FormControlLabel } from "@mui/material";

function FeedCollection() {
    const [feeds, setFeeds] = useState([]);
    const [isFiltered, setIsFiltered] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    useEffect(() => {
        const fetchFeeds = () => {
            fetch(`https://localhost:7174/api/feed/get-feed?isFiltered=${isFiltered}`, {
                method: "GET",
                credentials: "include",
            })
                .then((response) => {
                    return response.json().then((result) => {
                        if (response.ok) {
                            setFeeds(result.newFeeds);
                        } else {
                            showSnackbar(result.message);
                        }
                    });
                })
                .catch((error) => {
                    console.error("Network error:", error);
                    showSnackbar(error.message);
                }); 
        };

        fetchFeeds();
    }, [isFiltered]);

    const handleFilterChange = (event) => {
        setIsFiltered(event.target.checked);
    };

    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    return (
        <>
            <Box sx={{ padding: 4 }}>
                <Typography variant="h3" align="center" gutterBottom sx={{ color: "#102e1d" }}>
                    Feed Warehouse
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                    <FormControlLabel
                        control={
                            <Switch checked={isFiltered} onChange={handleFilterChange} color="primary"/>
                        }
                        label="Show only feeds eaten by zoo animals"
                    />
                </Box>

                <Grid container spacing={3} justifyContent="center">
                    {feeds.map((feed) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={feed.id}>
                            <Card sx={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "mediumseagreen" }}>
                                <CardMedia component="img" height="300" image={feed.feedImage} alt={feed.feedName} sx={{ objectFit: "cover" }}/>
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {feed.feedName}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Value: {feed.price}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                <Alert severity="error" onClose={() => setSnackbarOpen(false)}  sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>  
    );
};

export default FeedCollection;