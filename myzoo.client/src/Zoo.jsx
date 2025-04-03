import React, { useEffect, useState } from "react";

const AnimalZoo = () => {
    const [zooAnimals, setZooAnimals] = useState([]);
    const [ticketPrice, setTicketPrice] = useState(0);

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

    const decreaseTicketPrice = async () => {
        try {
            const response = await fetch("https://localhost:7174/api/zoo/set-ticket-prices", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(ticketPrice - 1),
                credentials: "include",
            });

            const data = await response.json();
            if (response.ok) {
                setTicketPrice(data.newPrice);
                alert(data.message);
            } else {
                alert(data.message || "Hiba t�rt�nt a jegy�r friss�t�sekor.");
            }
        } catch (error) {
            console.error("H�l�zati hiba:", error);
            alert("Nem siker�lt friss�teni a jegy�rat.");
        }
    }

    const increaseTicketPrice = async () => {
        try {
            const response = await fetch("https://localhost:7174/api/zoo/set-ticket-prices", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(ticketPrice + 1),
                credentials: "include",
            });

            const data = await response.json();
            if (response.ok) {
                setTicketPrice(data.newPrice);
                alert(data.message);
            } else {
                alert(data.message || "Hiba t�rt�nt a jegy�r friss�t�sekor.");
            }
        } catch (error) {
            console.error("H�l�zati hiba:", error);
            alert("Nem siker�lt friss�teni a jegy�rat.");
        }
    }    

    return (
        <div>
            <h1>Zoo</h1>
            <div>
                <h2>Aktu�lis jegy�r: {ticketPrice}</h2>
                <button onClick={increaseTicketPrice}>Jegy�r n�vel�se</button>
                <button onClick={decreaseTicketPrice}>Jegy�r cs�kkent�se</button>
            </div>
            {zooAnimals.length === 0 ? (
                <p>Nincsenek �llatok az �llatkertben.</p>
            ) : (
                zooAnimals.map((animal) => (
                    <div key={animal.warehouseAnimalId}>
                        <img src={animal.image} alt={animal.animalSpecies?.species} width="100" />
                        <p>{animal.animalSpecies?.species}</p>
                        <p>Sex: {animal.gender === 0 ? "N�st�ny" : animal.gender === 1 ? "H�m" : "K�ly�k"}</p>
                        <button onClick={() => removeFromZoo(animal.warehouseAnimalId)}>Remove</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default AnimalZoo;