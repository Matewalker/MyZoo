import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Zoo = () => {
    const [ticketPrice, setTicketPrice] = useState(1000);
    const [animals, setAnimals] = useState([
        { id: 1, name: "Elefánt", age: 5 },
        { id: 2, name: "Tigris", age: 3 },
        { id: 3, name: "Zebra", age: 2 },
    ]);

    const updateTicketPrice = (e) => {
        setTicketPrice(e.target.value);
    };

    return (
        <div className="p-4 space-y-4">
            <Card className="p-4">
                <h2 className="text-xl font-bold">Jegyár beállítása</h2>
                <div className="flex items-center space-x-2 mt-2">
                    <Input
                        type="number"
                        value={ticketPrice}
                        onChange={updateTicketPrice}
                    />
                    <Button>Mentés</Button>
                </div>
            </Card>

            <Card className="p-4">
                <h2 className="text-xl font-bold">Állatok listája</h2>
                <div className="space-y-2 mt-2">
                    {animals.map((animal) => (
                        <Card key={animal.id} className="p-2 flex justify-between">
                            <CardContent>
                                <p className="text-lg">{animal.name}</p>
                                <p className="text-sm text-gray-500">Kor: {animal.age} év</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default Zoo;