import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper, Alert, GlobalStyles } from "@mui/material";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!username || !password || !confirmPassword) {
            setMessage("Please fill in all fields!");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("The two passwords do not match!");
            return;
        }

        const data = {
            Username: username,
            PasswordHash: password,
        };

        fetch("https://localhost:7174/api/account/register", {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                return response.json().then((result) => {
                    if (response.ok) {
                        setMessage(result.message);
                        navigate("/login");
                    } else {
                        setMessage(result.message);
                    }
                });
            })
            .catch((error) => {
                setMessage("Error in connection: " + error.message);
            });
    };

    return (
        <Box sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Paper elevation={3} sx={{ padding: 4, width: { xs: "90%", sm: "400px" }, display: "flex", flexDirection: "column", gap: 3, borderRadius: 2 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Registration
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth required/>
                        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth
                            required />
                        <TextField label="Confirm password" type="password" value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} fullWidth required />
                        <Button type="submit" variant="contained"
                            sx={{ backgroundColor: "mediumseagreen", fontSize: { xs: "1rem", sm: "1.1rem" },
                                '&:hover': { backgroundColor: "#2e8b57" } }}>
                            Registration
                        </Button>
                    </Box>
                </form>
                {message && <Alert severity="info">{message}</Alert>}
            </Paper>
        </Box>
    );
};

export default Register;