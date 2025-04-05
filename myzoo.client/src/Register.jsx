import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper, Alert, GlobalStyles } from "@mui/material";

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!username || !password) {
            setMessage("Felhasználónév és jelszó megadása kötelezõ!");
            return;
        }

        const data = {
            Username: username,
            PasswordHash: password,
        };

        try {
            const response = await fetch('https://localhost:7174/api/account/register', {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage('Sikeres regisztráció!');
                navigate('/login');
            } else {
                setMessage(result.message || 'Hiba történt a regisztráció során.');
            }
        } catch (error) {
            setMessage('Hiba a kapcsolatban:' + error.message);
        }
    };

    return (
        <>
            <GlobalStyles styles={{
                html: { margin: 0, padding: 0, height: "100%" },
                body: { margin: 0, padding: 0, height: "100%" },
                "#root": { height: "100%" }
            }} />

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh',
                 backgroundImage: "url('startBg.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>

            <Paper elevation={3} sx={{
                padding: 4,
                width: { xs: '90%', sm: '400px' },
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                borderRadius: 2,
            }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Registration
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                backgroundColor: "mediumseagreen",
                                fontSize: { xs: "1rem", sm: "1.1rem" },
                                '&:hover': { backgroundColor: "#2e8b57" }
                            }}
                        >
                            Registration
                        </Button>
                    </Box>
                </form>
                {message && <Alert severity="info">{message}</Alert>}
            </Paper>
            </Box>
        </>
    );
};

export default Register;