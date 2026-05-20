import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
  Avatar,
  WrapItem,
} from "@chakra-ui/react";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

const logOut = () => {
    localStorage.removeItem("authToken");
    window.dispatchEvent(new Event("authChange"));
    setUsername(null);
    setMenuOpen(false);
    navigate("/login");
};

  useEffect(() => {
      const loadUser = () => {
          const token = localStorage.getItem("authToken");
          if (token) {
              try {
                  const decodedToken = jwtDecode(token);
                  const { name } = decodedToken;
                  setUsername(name);
              } catch (error) {
                  console.error("Error decoding token:", error);
              }
          } else {
              setUsername(null);
          }
      };

      loadUser(); // run on mount
      window.addEventListener("authChange", loadUser); // run on login/logout

      return () => window.removeEventListener("authChange", loadUser); // cleanup
  }, []);

  return (
    <div className="navbar bg-white border-gray-200 dark:bg-gray-800">
      <div className="logo">
        <img
          src="/images/store_12356588.png"
          className="logo-image"
        />
      </div>

      <Menu>
        <MenuButton>
          <WrapItem>
            <Avatar
              size="sm"
              name={username || "Guest"}
              src="https://bit.ly/tioluwani-kolawole"
            />
          </WrapItem>
        </MenuButton>
        <MenuList bg="black">
          <MenuGroup  title={`Hello, ${username || "Guest"}`}>
            <MenuItem as={Link} to="/cart" bg="black">
              Cart
            </MenuItem>
            <MenuItem as={Link} to="/" bg="black">
              Orders
            </MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuGroup>
            <MenuItem onClick={logOut} color="red.500" bg="black">
              Log Out
            </MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>
    </div>
  );
}

export default NavBar;