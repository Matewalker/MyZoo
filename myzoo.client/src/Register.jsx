import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();  // Megakad�lyozza az alap�rtelmezett form elk�ld�st
        try {
            const response = await fetch("https://localhost:7174/api/account/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, passwordHash: password }),
                credentials: "include", // Session-�k kezel�s�hez sz�ks�ges
            });

            const data = await response.json();
            if (response.ok) {
                navigate("/login");  // Sikeres regisztr�ci� ut�n �tir�ny�t�s a bejelentkez�shez
            } else {
                setMessage(data.message);  // Hib�s adat eset�n megjelen�tj�k a hiba�zenetet
            }
        } catch (error) {
            setMessage("Hiba t�rt�nt a regisztr�ci� sor�n: " + error.message);
        }
    };

    return (
        <div className="register-container">
            <h2>Regisztr�ci�</h2>
            <form onSubmit={handleRegister}>
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
                <button type="submit">Regisztr�ci�</button>
            </form>
            {message && <p style={{ color: "red" }}>{message}</p>}
        </div>
    );
}

export default Register;