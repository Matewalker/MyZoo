import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function BuyAnimals() {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("https://localhost:7174/api/buy/get-animals", {
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                setAnimals(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Hiba az állatok lekérésekor:", error);
                setLoading(false);
            });
    }, []);

    const buyAnimal = (id) => {
        fetch("https://localhost:7174/api/buy/buy-animal", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(id),
        })
            .then((response) => response.json())
            .then((data) => {
                alert(data.message);
                if (data.success) {
                    setAnimals((prev) => prev.filter((a) => a.id !== id));
                }
            })
            .catch((error) => console.error("Hiba a vásárláskor:", error));
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Animal shop</h2>
            <button onClick={() => navigate('/user-data')}>Back</button>
            <div className="grid grid-cols-3 gap-4">
                {animals.map((animal) => (
                    <div key={animal.id} className="border p-4 rounded-lg shadow">
                        <img
                            src={animal.image}
                            alt={animal.animalSpecies?.species}
                            className="w-full h-40 object-cover rounded"
                        />
                        <h3 className="text-xl font-semibold mt-2">{animal.animalSpecies?.species}</h3>
                        <p>Sex: {animal.gender === 0 ? "Nõstény" : animal.gender === 1 ? "Hím" : "Kölyök"}</p>
                        <p>Price: {animal.value}</p>
                        <button
                            onClick={() => buyAnimal(animal.id)}
                            className="mt-2 bg-blue-500 text-white py-1 px-3 rounded"
                        >
                            Buy
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BuyAnimals;


