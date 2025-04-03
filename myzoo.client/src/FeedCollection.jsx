import React, { useEffect, useState } from "react";

function FeedCollection() {
    const [feeds, setFeeds] = useState([]);

    // Az ételek lekérése
    useEffect(() => {
        const fetchFeeds = async () => {
            try {
                const response = await fetch("https://localhost:7174/api/feed/get-feed", {
                    method: "GET",
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setFeeds(data);
                } else {
                    alert("Nem sikerült lekérni az ételeket.");
                    console.log(response);
                }
            } catch (error) {
                console.error("Hálózati hiba:", error);
                alert("Hiba történt az ételek lekérésekor.");
            }
        };

        fetchFeeds();
    }, []);

    return (
        <div>
            <h1>Elérhetõ Eledel</h1>
            {feeds.length === 0 ? (
                <p>Nincsenek elérhetõ ételek.</p>
            ) : (
                <ul>
                    {feeds.map((feed) => (
                        <li key={feed.id}>
                            <p>{feed.feedName} - {feed.price}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


export default FeedCollection;