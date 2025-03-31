import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:7174/api/account/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, passwordHash: password }),
                credentials: "include", // Session-ök kezeléséhez szükséges
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Sikeres bejelentkezés!");

                // Itt navigálhatsz egy másik oldalra, miután sikerült a bejelentkezés
                navigate("/user-data"); // Például átirányítás a fõoldalra
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage("Hiba történt:" + error.message);
        }
    };

    return (
        <div className="login-container">
            <h2>Bejelentkezés</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Felhasználónév"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Jelszó"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Bejelentkezés</button>
            </form>
            {message && <p style={{ color: "red" }}>{message}</p>}
        </div>
    );
}

export default Login;