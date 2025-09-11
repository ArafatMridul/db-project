import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import axios from "axios";
import { useEffect } from "react";

const UserContex = createContext();

const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

    const login = async (inputs) => {
        const response = await axios.post(
            "http://localhost:8800/api/auth/login",
            inputs,
            {
                withCredentials: true,
            }
        );
        setCurrentUser(response.data);
    };

    const logout = async () => {
        await axios.post(
            "http://localhost:8800/api/auth/logout",
            {},
            {
                withCredentials: true,
            }
        );
        setCurrentUser(null);
    };

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    return (
        <UserContex.Provider value={{ currentUser, login, logout }}>
            {children}
        </UserContex.Provider>
    );
};

function useUser() {
    const context = useContext(UserContex);

    if (!context) throw new Error("UserContext used outside the UserProvider.");

    return context;
}

export { UserProvider, useUser };
