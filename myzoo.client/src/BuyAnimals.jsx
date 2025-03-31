import { useState, useEffect } from "react";

const BuyAnimals = () => {
    const [animals, setAnimals] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("/api/animals/buy")
            .then(response => response.json())
            .then(data => setAnimals(data))
            .catch(error => setError(error.message));
    }, []);

    const handleBuy = async (animalId) => {
        try {
            const response = await fetch("/api/animals/buy", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ animalId })
            });

            if (!response.ok) {
                throw new Error("V�s�rl�s sikertelen.");
            }

            setAnimals(prevAnimals => prevAnimals.filter(a => a.id !== animalId));
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h1>V�s�rolhat� �llatok</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <ul>
                {animals.map(animal => (
                    <li key={animal.id}>
                        <img src={animal.image} alt={animal.species} width={100} />
                        <p>{animal.species} - {animal.gender === 1 ? "H�m" : "N�st�ny"}</p>
                        <p>�r: {animal.value}</p>
                        <button onClick={() => handleBuy(animal.id)}>Megvesz</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BuyAnimals;
