import React, { createContext, useState } from "react";

export const AnimalContext = createContext();

export const AnimalProvider = ({ children }) => {
    const [animalData, setAnimalData] = useState([])

    return (
        <AnimalContext.Provider value={{ animalData, setAnimalData }}>
            {children}
        </AnimalContext.Provider>
    );
};