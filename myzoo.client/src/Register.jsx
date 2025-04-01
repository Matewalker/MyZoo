import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
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
            PasswordHash: password,  // Itt jelszó titkosítását a backend végzi
        };

        try {
            const response = await fetch('https://localhost:7174/api/account/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
        <div className="register-container">
            <h2>Regisztráció</h2>
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
                <button type="submit">Regisztrálás</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;