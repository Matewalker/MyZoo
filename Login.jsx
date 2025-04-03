import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Valid�ci�
        if (!username || !password) {
            setMessage("Felhaszn�l�n�v �s jelsz� megad�sa k�telez�!");
            return;
        }

        const data = {
            Username: username,
            PasswordHash: password, // A backend v�gzi a jelsz� hash-el�s�t
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
                setMessage('Sikeres bejelentkez�s!');
                navigate('/user-data');
            } else {
                setMessage(result.message || 'Hiba t�rt�nt a bejelentkez�s sor�n.');
            }
        } catch (error) {
            setMessage('Hiba a kapcsolatban:' + error.message);
        }
    };

    return (
        <div className="login-container">
            <h2>Bejelentkez�s</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Felhaszn�l�n�v:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Jelsz�:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Bejelentkez�s</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;