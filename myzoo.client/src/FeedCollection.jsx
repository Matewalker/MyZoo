import React, { useEffect, useState } from "react";

function FeedCollection() {
    const [feeds, setFeeds] = useState([]);

    // Az �telek lek�r�se
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
                    alert("Nem siker�lt lek�rni az �teleket.");
                    console.log(response);
                }
            } catch (error) {
                console.error("H�l�zati hiba:", error);
                alert("Hiba t�rt�nt az �telek lek�r�sekor.");
            }
        };

        fetchFeeds();
    }, []);

    return (
        <div>
            <h1>El�rhet� Eledel</h1>
            {feeds.length === 0 ? (
                <p>Nincsenek el�rhet� �telek.</p>
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