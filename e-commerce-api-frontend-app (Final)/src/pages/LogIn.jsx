import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LogIn() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate(); 

    const handleLogIn = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8000/api/users/login", {
                method: "POST",
                mode: "cors",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });
    
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
    
            const data = await res.json();
            
            if (data.token) {
                localStorage.setItem('authToken', data.token);
                console.log('Saved token:', localStorage.getItem('authToken')); // Debug log
                setMessage(data.message);
                setName(data.name)
            }
        } catch (error) {
            console.error("Error logging in: ", error);
            setMessage("Error logging in. Please try again.");
        }
    };

    return (
        <div className="registration-container">
          {/* Image Section */}
          <div className="image-section">
            <img
              src="/public/images/Log-In-Page.jpg" 
              alt="Register Illustration"
              className="register-image"
            />
          </div>
    
          {/* Form Section */}
          <div className="form-section bg-white">
            <h2>Log In Form</h2>
            <form onSubmit={handleLogIn}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" 
              className="register-button"
              onClick={() => navigate("/")}
              >
                Sign In
              </button>
              <button
                type="button"
                className="already-account-button"
                onClick={() => navigate("/signup")}
              >
                Don't have an account?
              </button>
            </form>
            {message && <p className="message">{message}</p>}
          </div>
        </div>
      );
    }
    

export default LogIn;
