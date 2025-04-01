import { useState, useEffect } from "react";

function BuyAnimals() {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);

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
                console.error("Hiba az �llatok lek�r�sekor:", error);
                setLoading(false);
            });
    }, []);

    const buyAnimal = (id) => {
        fetch("/buy/animalbuy", {
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
            .catch((error) => console.error("Hiba a v�s�rl�skor:", error));
    };

    if (loading) return <p>Bet�lt�s...</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">�llatok v�s�rl�sa</h2>
            <div className="grid grid-cols-3 gap-4">
                {animals.map((animal) => (
                    <div key={animal.id} className="border p-4 rounded-lg shadow">
                        <img
                            src={animal.animalSpecies.image}
                            alt={animal.animalSpecies.name}
                            className="w-full h-40 object-cover rounded"
                        />
                        <h3 className="text-xl font-semibold mt-2">{animal.animalSpecies.name}</h3>
                        <p>Nem: {animal.gender === 0 ? "H�m" : "N�st�ny"}</p>
                        <p>�r: {animal.value} t�ke</p>
                        <button
                            onClick={() => buyAnimal(animal.id)}
                            className="mt-2 bg-blue-500 text-white py-1 px-3 rounded"
                        >
                            V�s�rl�s
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BuyAnimals;


