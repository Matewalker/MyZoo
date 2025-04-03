import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validáció
        if (!username || !password) {
            setMessage("Felhasználónév és jelszó megadása kötelezõ!");
            return;
        }

        const data = {
            Username: username,
            PasswordHash: password, // A backend végzi a jelszó hash-elését
        };

        try {
            const response = await fetch('https://localhost:7174/api/account/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                credentials: "include",
            });

            const result = await response.json();

            if (response.ok) {
                setMessage('Sikeres bejelentkezés!');
                navigate('/user-data');
            } else {
                setMessage(result.message || 'Hiba történt a bejelentkezés során.');
            }
        } catch (error) {
            setMessage('Hiba a kapcsolatban:' + error.message);
        }
    };

    return (
        <div className="login-container">
            <h2>Bejelentkezés</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Felhasználónév:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Jelszó:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Bejelentkezés</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;