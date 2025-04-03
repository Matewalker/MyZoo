import React, { useEffect, useState } from "react";

const AnimalZoo = () => {
    const [zooAnimals, setZooAnimals] = useState([]);

    useEffect(() => {
        fetch("https://localhost:7174/api/zoo/get-zoo-animals", {
            method: "GET",
            credentials: "include",
        })
            .then(response => {
                console.log("HTTP v�lasz objektum:", response);
                return response.json();
            })
            .then(data => {
                console.log("API v�lasz JSON:", data);
                setZooAnimals(data.animals || []);
            })
            .catch(error => console.error("Hiba t�rt�nt:", error));
    }, []);


    const removeFromZoo = async (id) => {
        try {
            const response = await fetch("https://localhost:7174/api/buy/remove-from-zoo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(id),
                credentials: "include",
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
                zooAnimals.map((animal) => (
                    <div key={animal.warehouseAnimalId}>
                        <img src={animal.image} alt={animal.animalSpecies?.species} width="100" />
                        <p>{animal.animalSpecies?.species}</p>
                        <p>Nem: {animal.gender === 0 ? "N�st�ny" : animal.gender === 1 ? "H�m" : "K�ly�k"}</p>
                        <button onClick={() => removeFromZoo(animal.warehouseAnimalId)}>Elt�vol�t�s az �llatkertb�l</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default AnimalZoo;