import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
// import { Elements } from "@stripe/react-stripe-js" 
import { loadStripe } from "@stripe/stripe-js";

function Cart() {
  const [username, setUsername] = useState(null);
  const [cart, setCart] = useState(null);
  const [userID, setUserID] = useState(null);
  const [error, setError] = useState(null);
  const baseURL = "http://localhost:8000";

  const fetchUserCart = async (userID) => {
    try {
      const response = await fetch(`${baseURL}/api/users/${userID}/cart`, {
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setCart(data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.name);
        setUserID(decodedToken.userId);
        fetchUserCart(decodedToken.userId);
      } catch (error) {
        console.error("Error decoding token:", error);
        setError("Invalid token");
      }
    } else {
      setError("No token found");
    }
  }, []);

  const updateCartItemQuantity = async (productId, newQuantity) => {
    try {
      const response = await fetch(`${baseURL}/api/users/${userID}/cart`, {
        method: "PATCH",
        mode: "cors",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          productId: productId, 
          quantity: newQuantity 
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }


      fetchUserCart(userID);
    } catch (error) {
      console.error("Error updating cart item quantity", error);
      setError("Failed to update cart item quantity");
    }
  };

  const deleteCartItem = async (productId) => {
    try {
      const response = await fetch(`${baseURL}/api/users/${userID}/cart`, {
        method: "DELETE",
        mode: "cors",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      fetchUserCart(userID); 
    } catch (error) {
      console.error("Error occurred while deleting item from cart", error);
      setError("Failed to delete item from cart");
    }
  };

  const proceedToCheckout = async() => {
    try {
        const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

        const response = await fetch(`${baseURL}/api/users/${userID}/cart/checkout`, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ cart: cart.items })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || "Checkout failed");
        }

        await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch(error) {
        console.error("Checkout Error:", error);
        setError(error.message);
    }
}

  return (
    <div className="bg-gray-900 min-h-screen p-4">
      {error && <p className="text-red-500">Error: {error}</p>}
      
      {username && (
        <h2 className="mb-4 text-3xl font-extrabold text-center text-white">
          Welcome, {username}!
        </h2>
      )}

      {cart && cart.items && cart.items.length > 0 ? (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Product Image</th>
                <th scope="col" className="px-6 py-3">Product Name</th>
                <th scope="col" className="px-6 py-3">Quantity</th>
                <th scope="col" className="px-6 py-3">Total Price</th>
                <th scope="col" className="px-6 py-3">Remove item from cart</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr
                  key={item.productId}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <td className="p-4">
                    <img
                      src={`http://localhost:8000${item.productImage}`}
                      alt={item.productName}
                      style={{ width: "100px" }}
                    />
                  </td>
                  <td className="px-6 py-4">{item.productName}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <button 
                        onClick={() => updateCartItemQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        className="bg-gray-200 px-2 py-1 rounded-l"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = Math.max(1, parseInt(e.target.value) || 1);
                          updateCartItemQuantity(item.productId, newQuantity);
                        }}
                        min="1"
                        className="w-16 text-center mx-2 border"
                      />
                      <button 
                        onClick={() => updateCartItemQuantity(item.productId, item.quantity + 1)}
                        className="bg-gray-200 px-2 py-1 rounded-r"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {new Intl.NumberFormat("en-ZA", {
                      style: "currency",
                      currency: "ZAR",
                    }).format(item.totalPrice)}
                  </td>
                  <td className="p-4">
                    <button
                     onClick={() => deleteCartItem(item.productId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-400 text-center">Your cart is empty.</p>
      )}

      {cart && cart.items && cart.items.length > 0 && (
        <div className="text-center mt-4">
          <button
          onClick={proceedToCheckout} 
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;