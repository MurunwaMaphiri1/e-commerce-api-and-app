E-Commerce API


Overview
This project is an API for an e-commerce platform that allows users to sign up, log in, add products to a shopping cart, remove products, view and search for products, and checkout with a payment gateway. The backend includes JWT authentication for secure user interaction and integrates with Stripe for handling payments.

Additionally, the project includes a simple frontend built with React to interact with the API.

Requirements
JWT authentication for secure user management.
Ability for users to sign up, log in, and manage their accounts.
CRUD operations for managing products in the store.
Integration with Stripe payment gateway for secure checkout.
Admin panel for adding/removing products, setting prices, and managing inventory.

Functionality

User Authentication
Sign Up: Users can sign up to create an account.
Log In: Users can log in to access their profile and perform actions like adding/removing products from their cart.


Product Management
Add Products to Cart: Users can add products to their shopping cart.
Remove Products from Cart: Users can remove products from their cart.
View and Search Products: Users can view products.


Checkout and Payment
Checkout: Users can proceed to checkout to view their cart and proceed with payment.
Stripe Integration: Stripe is used as the payment gateway. Upon successful payment, a message will be displayed confirming the successful payment. (Note: The order creation on successful payment doesn't work due to a failed ngrok setup; the intended behavior was to create an order upon payment.)



Technologies Used
Backend: Node.js, Express.js
Frontend: React.js
Database: MongoDB
Authentication: JWT (JSON Web Tokens)
Payment Gateway: Stripe
Other: Postman (for testing API)


Setup
Prerequisites
Node.js
MongoDB (local or cloud instance)
Stripe account for payment integration

MONGO_URI: Your MongoDB connection string.
JWT_SECRET: A secret key for JWT authentication.
STRIPE_SECRET_KEY: Your Stripe secret key.


Testing with Postman
Use Postman to test API endpoints like signing up, logging in, adding/removing products to/from the cart, and making payments. Ensure that all endpoints are functioning as expected before connecting with the frontend.

Known Issues
The order creation functionality after a successful Stripe payment does not work as expected due to a failed ngrok setup. The intended behavior is for the API to create an order upon successful payment, but currently, it only returns a message confirming the successful payment.


Future Improvements
Fix the order creation logic after Stripe payment.
Implement more robust error handling and validation.
Improve the admin panel to allow for more granular control over product management.

