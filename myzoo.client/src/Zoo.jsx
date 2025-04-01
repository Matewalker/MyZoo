import React, { useState } from "react";

const Zoo = () => {
    const [ticketPrice, setTicketPrice] = useState(1000);

    const updateTicketPrice = (e) => {
        setTicketPrice(e.target.value);
    };

    return (
        <div className="p-4 space-y-4">
            <div className="p-4">
                <h2 className="text-xl font-bold">Jegy�r be�ll�t�sa</h2>
                <div className="flex items-center space-x-2 mt-2">
                    <input
                        type="number"
                        value={ticketPrice}
                        onChange={updateTicketPrice}
                    />
                    <button>Ment�s</button>
                </div>
            </div>

            <div className="p-4">
                <h2 className="text-xl font-bold">�llatok list�ja</h2>
                <div className="space-y-2 mt-2">
                    
                </div>
            </div>
        </div>
    );
};

export default Zoo;