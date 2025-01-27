import React, { useEffect, useState } from "react";
import ProductDetails from "./ProductDetails";
import { useNavigate } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const fetchProductData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/products");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  const handleProductClick = (id) => {
    navigate(`/products/${id}`)
  }

  return (
    <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(271px,1fr))] place-items-center sm:place-items-start md:place-items-start lg:place-items-start xl:place-items-start gap-4 p-4">
      {error && <p className="text-red-500">Error: {error}</p>}
      {products.map((product) => (
        <div
          key={product._id}
          className="w-[280px] p-4 hover:bg-slate-800 rounded transition-colors cursor-pointer"
          onClick={() => handleProductClick(product._id)}
        >
          <div className="w-full relative">
            <img
              src={`http://localhost:8000${product.image}`}
              alt={product.name}
              className="w-full h-auto object-cover rounded"
              loading="lazy"
            />
            <div className="absolute top-1 left-1 w-auto p-2 justify-between items-center space-y-2 rounded z-40">
              <button className="text-xs flex items-center group cursor-pointer p-1 rounded hover:bg-blue-700 bg-slate-900 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <h3 className="text-lg font-semibold mt-2 text-white">{product.name}</h3>
          <p className="text-sm text-gray-300">
            Price: {new Intl.NumberFormat('en-ZA', {
              style: 'currency',
              currency: 'ZAR'
            }).format(product.price)}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
