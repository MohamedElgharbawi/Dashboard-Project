/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {

    const [admin, setAdmin] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedAdmin = localStorage.getItem("displayName");

        if (storedToken) setToken(storedToken);
        if (storedAdmin) setAdmin(storedAdmin);
    }, []);

    return (
        <UserContext.Provider value={{ admin, setAdmin, token, setToken }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;

export const useAdmin = () => useContext(UserContext);