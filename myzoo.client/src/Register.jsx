import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();  // Megakadályozza az alapértelmezett form elküldést
        try {
            const response = await fetch("https://localhost:7174/api/account/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, passwordHash: password }),
                credentials: "include", // Session-ök kezeléséhez szükséges
            });

            const data = await response.json();
            if (response.ok) {
                navigate("/login");  // Sikeres regisztráció után átirányítás a bejelentkezéshez
            } else {
                setMessage(data.message);  // Hibás adat esetén megjelenítjük a hibaüzenetet
            }
        } catch (error) {
            setMessage("Hiba történt a regisztráció során: " + error.message);
        }
    };

    return (
        <div className="register-container">
            <h2>Regisztráció</h2>
            <form onSubmit={handleRegister}>
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
                <button type="submit">Regisztráció</button>
            </form>
            {message && <p style={{ color: "red" }}>{message}</p>}
        </div>
    );
}

export default Register;