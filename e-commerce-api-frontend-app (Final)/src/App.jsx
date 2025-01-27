import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import HomePage from "./pages/HomePage";
import NavBar from "./pages/components/Navbar";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import { ChakraProvider } from "@chakra-ui/react";
import Footer from "./pages/components/Footer";
import Success from "./pages/Success";
import PaymentUnsuccessful from "./pages/Failed";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-900">
          <NavBar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/products/:id" element={<ProductDetails/>} />
              <Route path="/success" element={<Success/>}/>
              <Route path="/cancel" element={<PaymentUnsuccessful/>}/>
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ChakraProvider>
  );
}

export default App;
