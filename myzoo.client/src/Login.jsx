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
                credentials: "include", // Session-�k kezel�s�hez sz�ks�ges
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Sikeres bejelentkez�s!");

                // Itt navig�lhatsz egy m�sik oldalra, miut�n siker�lt a bejelentkez�s
                navigate("/user-data"); // P�ld�ul �tir�ny�t�s a f�oldalra
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage("Hiba t�rt�nt:" + error.message);
        }
    };

    return (
        <div className="login-container">
            <h2>Bejelentkez�s</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Felhaszn�l�n�v"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Jelsz�"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Bejelentkez�s</button>
            </form>
            {message && <p style={{ color: "red" }}>{message}</p>}
        </div>
    );
}

export default Login;