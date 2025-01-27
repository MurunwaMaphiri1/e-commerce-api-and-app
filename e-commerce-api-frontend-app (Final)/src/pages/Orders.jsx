import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function Orders() {
    const [username, setUsername] = useState(null);
    const [error, setError] = useState(null);
    const [userID, setUserID] = useState(null);
    //   const [cart, setCart] = useState(null);
    const baseURL = "http://localhost:8000";

    const fetchUserOrder = async(userID) => {
        try {
            const response = await fetch(`${baseURL}/api/users/${userID}/orders`, {
                method: "POST",
                mode: "cors",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId: userID, cart: cart.items })
            })
        } catch(error) {
            console.error(`Error occured `, error)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUsername(decodedToken.name);
                setUserID(decodedToken.userId);
                fetchUserOrder(decodedToken.userId);
            } catch(error) {
                console.error("Error decoding token:", error);
                setError("Invalid token");
            }
        } else {
            setError("No token found");
        }
    }, []);

    return (
        <>
        </>
    )
}

export default Orders;