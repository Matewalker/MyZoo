import React, { useEffect, useState } from "react";

const AnimalZoo = () => {
    const [zooAnimals, setZooAnimals] = useState([]);

    useEffect(() => {
        // Az állatkertbe tartozó állatok lekérése
        const fetchZooAnimals = async () => {
            try {
                const response = await fetch("https://localhost:7174/api/zoo/get-zoo-animals");
                if (response.ok) {
                    const data = await response.json();
                    setZooAnimals(data); // Az állatkertben lévõ állatok
                } else {
                    alert("Nem sikerült lekérni az állatokat.");
                    console.log(response.data);
                }
            } catch (error) {
                console.error("Hálózati hiba:", error);
                alert("Hiba történt a lekérés során.");
            }
        };

        fetchZooAnimals();
    }, []);


    const removeFromZoo = async (id) => {
        try {
            const response = await fetch("https://localhost:7174/api/buy/remove-from-zoo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ warehouseAnimalId: id }), // Küldés JSON formátumban
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message); // Sikeres eltávolítás üzenet
                setZooAnimals(zooAnimals.filter((animal) => animal.id !== id)); // Az eltávolított állat eltüntetése a listából
            } else {
                alert(data.message || "Hiba történt!");
            }
        } catch (error) {
            console.error("Hálózati hiba:", error);
            alert("Nem sikerült eltávolítani az állatot az állatkertbõl.");
        }
    };

    return (
        <div>
            <h1>Állatkert Állatai</h1>
            {zooAnimals.length === 0 ? (
                <p>Nincsenek állatok az állatkertben.</p>
            ) : (
                <ul>
                    {zooAnimals.map((animal) => (
                        <li key={animal.id}>
                            <img src={animal.image} alt={animal.species} width={100} />
                            <p>{animal.species}</p>
                            <button onClick={() => removeFromZoo(animal.id)}>Eltávolítás az állatkertbõl</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AnimalZoo;