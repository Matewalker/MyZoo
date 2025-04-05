import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, CardMedia, Typography, Grid } from "@mui/material";

function FeedCollection() {
    const [feeds, setFeeds] = useState([]);

    // Az ételek lekérése
    useEffect(() => {
        const fetchFeeds = async () => {
            try {
                const response = await fetch("https://localhost:7174/api/feed/get-feed", {
                    method: "GET",
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setFeeds(data);
                } else {
                    alert("Nem sikerült lekérni az ételeket.");
                    console.log(response);
                }
            } catch (error) {
                console.error("Hálózati hiba:", error);
                alert("Hiba történt az ételek lekérésekor.");
            }
        };

        fetchFeeds();
    }, []);

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Feed Warehouse
            </Typography>

                <Grid container spacing={3}>
                    {feeds.map((feed) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={feed.id}>
                            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                <CardMedia
                                    component="img"
                                    height="300"
                                    image={feed.feedImage}
                                    alt={feed.feedName}
                                    sx={{ objectFit: "cover" }}
                                />
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
    );
};


export default FeedCollection;