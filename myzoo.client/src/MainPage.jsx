import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
    const [date, setDate] = useState("2025-Jan");
    const [capital, setCapital] = useState(0);
    const [visitors, setVisitors] = useState(0);
    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    useEffect(() => {
        if (!username) {
            navigate("/login");
            return;
        };
        async function fetchData() {
            try {
                let response = await fetch("http://localhost:7174/api/menu/user-data/${username}");
                let data = await response.json();
                if (data.success) {
                    setDate(data.currentDate);
                    setCapital(data.capital);
                    setVisitors(data.visitors);
                } else {
                    navigate("/login");
                }
            } catch (error) {
                console.error("Hiba történt:", error);
            }
        }
        fetchData();
    }, [navigate, username]);

    async function nextTurn() {
        try {
            let response = await fetch("http://localhost:7174/api/menu/next-turn", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            let data = await response.json();

            if (!response.ok) {
                throw new Error("Hiba történt a szerveren.");
            }

            if (data.success) {
                setDate(data.newDate);
                setCapital(data.newCapital);
                setVisitors(data.newVisitors);
            } else {
                alert("Hiba történt: " + data.message);
            }
        } catch (error) {
            console.error("Hiba történt:", error);
            alert("Hálózati hiba vagy szerverhiba történt!");
        }
    }

    return (
        <div className="container mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">Fõmenü</h1>

            <h3 className="text-center text-xl mb-4">
                Jelenlegi dátum: <span className="font-semibold">{date}</span>
            </h3>

            <div className="text-center mb-6">
                <button onClick={nextTurn} className="btn btn-primary">
                    Következõ hónap
                </button>
            </div>

            <div className="text-center mb-4 text-xl">
                Jelenlegi tõke: <span className="text-green-600 font-bold">{capital}</span>
            </div>

            <div className="text-center mb-8 text-xl">
                Havi látogatók: <span className="text-green-600 font-bold">{visitors}</span>
            </div>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                <button onClick={() => navigate("/buy-packs")} className="menu-btn bg-yellow-400">
                    Csomagok vásárlása
                </button>
                <button onClick={() => navigate("/buy-animals")} className="menu-btn bg-yellow-400">
                    Állatok vásárlása
                </button>
                <button onClick={() => navigate("/zoo")} className="menu-btn bg-green-500">
                    Az állatkert
                </button>
                <button onClick={() => navigate("/food-storage")} className="menu-btn bg-blue-400">
                    Étel raktár
                </button>
                <button onClick={() => navigate("/animal-storage")} className="menu-btn bg-blue-400">
                    Állat raktár
                </button>
            </div>
        </div>
    );
}