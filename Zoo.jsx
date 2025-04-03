import React, { useEffect, useState } from "react";

const AnimalZoo = () => {
    const [zooAnimals, setZooAnimals] = useState([]);

    useEffect(() => {
        // Az �llatkertbe tartoz� �llatok lek�r�se
        const fetchZooAnimals = async () => {
            try {
                const response = await fetch("https://localhost:7174/api/zoo/get-zoo-animals");
                if (response.ok) {
                    const data = await response.json();
                    setZooAnimals(data); // Az �llatkertben l�v� �llatok
                } else {
                    alert("Nem siker�lt lek�rni az �llatokat.");
                    console.log(response.data);
                }
            } catch (error) {
                console.error("H�l�zati hiba:", error);
                alert("Hiba t�rt�nt a lek�r�s sor�n.");
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
                body: JSON.stringify({ warehouseAnimalId: id }), // K�ld�s JSON form�tumban
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message); // Sikeres elt�vol�t�s �zenet
                setZooAnimals(zooAnimals.filter((animal) => animal.id !== id)); // Az elt�vol�tott �llat elt�ntet�se a list�b�l
            } else {
                alert(data.message || "Hiba t�rt�nt!");
            }
        } catch (error) {
            console.error("H�l�zati hiba:", error);
            alert("Nem siker�lt elt�vol�tani az �llatot az �llatkertb�l.");
        }
    };

    return (
        <div>
            <h1>�llatkert �llatai</h1>
            {zooAnimals.length === 0 ? (
                <p>Nincsenek �llatok az �llatkertben.</p>
            ) : (
                <ul>
                    {zooAnimals.map((animal) => (
                        <li key={animal.id}>
                            <img src={animal.image} alt={animal.species} width={100} />
                            <p>{animal.species}</p>
                            <button onClick={() => removeFromZoo(animal.id)}>Elt�vol�t�s az �llatkertb�l</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AnimalZoo;