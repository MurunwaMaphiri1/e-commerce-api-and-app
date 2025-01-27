import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate(); 

    const handleSignup = async (e) => {
        e.preventDefault(); // Prevent page reload
        try {
            const res = await fetch("http://localhost:8000/api/users/signup", {
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
            setMessage(data.message);
        } catch (error) {
            console.error("Error signing up: ", error);
            setMessage("Error signing up. Please try again.");
        }
    };

    return (
        <div className="registration-container">
          {/* Image Section */}
          <div className="image-section">
            <img
              src="/public/images/Sign-Up-Page.jpg" 
              alt="Register Illustration"
              className="register-image"
            />
          </div>
    
          {/* Form Section */}
          <div className="form-section bg-white">
            <h2>Register Form</h2>
            <form onSubmit={handleSignup}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  required
                />
              </div>
              <button type="submit" className="register-button">
                Register
              </button>
              <button
                type="button"
                className="already-account-button"
                onClick={() => navigate("/login")}
              >
                Already have an account?
              </button>
            </form>
            {message && <p className="message">{message}</p>}
          </div>
        </div>
      );
    }
    

export default SignUp;
