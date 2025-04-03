import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
    const [userData, setUserData] = useState({
        currentDate: '',
        capital: 0,
        visitors: 0,
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await fetch("https://localhost:7174/api/user/get-username", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!userResponse.ok) {
                    throw new Error("Felhasználó nincs bejelentkezve.");
                }

                const userData = await userResponse.json();
                const username = userData.username;

                const response = await fetch(`https://localhost:7174/api/menu/user-data/${username}`, {
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Hiba a felhasználói adatok lekérése közben");
                }

                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    // Handle the next turn functionality
    const handleNextTurn = async () => {
        try {
            const response = await fetch('https://localhost:7174/api/menu/next-turn', {
                method: 'POST',
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error('Hiba a következõ kör feldolgozása közben');
            }
            const data = await response.json();
            setUserData({
                ...userData,
                currentDate: data.newDate,
                capital: data.newCapital,
                visitors: data.newVisitors,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="menu">
            <h1>My Zoo</h1>
            <div className="menu-info">
                <div>
                    <span>Date: {userData.currentDate}</span>
                    <button onClick={handleNextTurn}>Next month</button>
                </div>
                <div>
                    <span>Capital: {userData.capital}</span>
                </div>
                <div>
                    <span>Visitors: {userData.visitors}</span>
                </div>
            </div>
            <div className="menu-buttons">
                <button onClick={() => navigate('/animal-shop')}>Animal shop</button>
                <button onClick={() => navigate('/animal-warehouse')}>Animal warehouse</button>
                <button onClick={() => navigate('/zoo')}>Zoo</button>
                <button onClick={() => navigate('/feeds')}>Feed warehouse</button>
            </div>
        </div>
    );
};

export default MainPage;