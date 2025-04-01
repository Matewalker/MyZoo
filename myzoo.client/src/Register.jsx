import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
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
            PasswordHash: password,  // Itt jelsz� titkos�t�s�t a backend v�gzi
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
                setMessage('Sikeres regisztr�ci�!');
                navigate('/login');
            } else {
                setMessage(result.message || 'Hiba t�rt�nt a regisztr�ci� sor�n.');
            }
        } catch (error) {
            setMessage('Hiba a kapcsolatban:' + error.message);
        }
    };

    return (
        <div className="register-container">
            <h2>Regisztr�ci�</h2>
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
                <button type="submit">Regisztr�l�s</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;