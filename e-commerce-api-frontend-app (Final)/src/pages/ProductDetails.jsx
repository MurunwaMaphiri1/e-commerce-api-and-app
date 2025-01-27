import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userID, setUserID] = useState(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [quantity, setQuantity] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                const res = await fetch(`http://localhost:8000/api/products/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                setProduct(data);
            } catch (error) {
                console.error("Error fetching data: ", error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);


    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const { userId } = decodedToken; 
                setUserID(userId);
            } catch (error) {
                console.error("Error decoding token", error);
                setError("Invalid token");
            }
        }
    }, []);

    const handleQuantityChange = (e) => {
        const value = Math.max(1, parseInt(e.target.value) || 1);
        setQuantity(value);
    };

    const handleAddToCart = async () => {
        if (!userID) {
            setError("Please log in to add items to cart");
            return;
        }
        try {
            setIsAddingToCart(true);
            const res = await fetch(`http://localhost:8000/api/users/${userID}/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ productId: product._id, quantity: quantity }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            
            console.log("Product added to cart successfully");
        } catch (error) {
            console.error("Error adding product to cart: ", error);
            setError("Failed to add product to cart");
        } finally {
            setIsAddingToCart(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
        </div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="text-red-600">Error: {error}</div>
        </div>;
    }

    if (!product) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="text-gray-600">Product not found</div>
        </div>;
    }

    return (
        <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
            <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
                    <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
                        {/* <img 
                            className="w-full dark:hidden" 
                            src={`http://localhost:8000${product.image}`} 
                            alt={product.name} 
                        /> */}
                        <img 
                            className="w-full hidden dark:block" 
                            src={`http://localhost:8000${product.image}`} 
                            alt={product.name} 
                        />
                    </div>
                    {/*Product name*/}
                    <div className="mt-6 sm:mt-8 lg:mt-0">
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                            {product.name}
                        </h1>
                        {/* Price*/}
                        <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                            <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                                {new Intl.NumberFormat('en-ZA', {
                                    style: 'currency',
                                    currency: 'ZAR'
                                }).format(product.price)
                                }
                            </p>
                        </div>

                        <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
                            {/*Add to cart button*/}
                            <button
                                onClick={handleAddToCart}
                                disabled={isAddingToCart}
                                className={`text-white mt-4 sm:mt-0 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800 flex items-center justify-center ${isAddingToCart ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <svg
                                    className="w-5 h-5 -ms-2 me-2"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                                    />
                                </svg>
                                {isAddingToCart ? 'Adding...' : 'Add to cart'}
                            </button>
                            {/*Quantity input field*/}                   
                            <form className="max-w-sm mx-auto">
                                <label htmlFor="number-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quantity:</label>
                                <input type="number" value={quantity} id="number-input" onChange={handleQuantityChange} aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="90210" required />
                            </form>
                        </div>

                        <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />
                        {/*Product description*/}
                        <p className="mb-6 text-gray-500 dark:text-gray-400">
                            {product.productDescription}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProductDetails;