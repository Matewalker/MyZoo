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
                console.log("HTTP válasz objektum:", response);
                return response.json();
            })
            .then(data => {
                console.log("API válasz JSON:", data);
                setZooAnimals(data.animals || []);
            })
            .catch(error => console.error("Hiba történt:", error));
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
                alert(data.message || "Hiba történt a jegyár frissítésekor.");
            }
        } catch (error) {
            console.error("Hálózati hiba:", error);
            alert("Nem sikerült frissíteni a jegyárat.");
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
                alert(data.message || "Hiba történt a jegyár frissítésekor.");
            }
        } catch (error) {
            console.error("Hálózati hiba:", error);
            alert("Nem sikerült frissíteni a jegyárat.");
        }
    }    

    return (
        <div>
            <h1>Zoo</h1>
            <div>
                <h2>Aktuális jegyár: {ticketPrice}</h2>
                <button onClick={increaseTicketPrice}>Jegyár növelése</button>
                <button onClick={decreaseTicketPrice}>Jegyár csökkentése</button>
            </div>
            {zooAnimals.length === 0 ? (
                <p>Nincsenek állatok az állatkertben.</p>
            ) : (
                zooAnimals.map((animal) => (
                    <div key={animal.warehouseAnimalId}>
                        <img src={animal.image} alt={animal.animalSpecies?.species} width="100" />
                        <p>{animal.animalSpecies?.species}</p>
                        <p>Sex: {animal.gender === 0 ? "Nõstény" : animal.gender === 1 ? "Hím" : "Kölyök"}</p>
                        <button onClick={() => removeFromZoo(animal.warehouseAnimalId)}>Remove</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default AnimalZoo;