'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { axiosClient } from "../../axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    // Load auth data from localStorage on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedToken = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");

            if (storedToken) {
                setToken(storedToken);
                setIsAuthenticated(true);
            }

            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
    }, []);

    // Sign-in function
    const signin = async (email, password) => {
        try {
            // Step 1: Log in and obtain token
            const response = await axiosClient.post(`/v1/auth/login?platform=admin`, { email, password });
            const { access_token } = response.data.token;
            setToken(access_token);

            if (typeof window !== "undefined") {
                localStorage.setItem("token", access_token);
            }

            // Step 2: Fetch user profile with the token
            const userDataResponse = await axiosClient.get("/v1/profiles/me", {
                headers: { Authorization: `Bearer ${access_token}` },
            });
            
            // Extract user data from the "data" field in the response
            const userData = userDataResponse.data.data; // Access the 'data' object directly here
            setUser(userData);

            if (typeof window !== "undefined") {
                localStorage.setItem("user", JSON.stringify(userData));
            }

            setIsAuthenticated(true);
        } catch (error) {
            console.error("Error signing in", error);
            throw error;
        }
    };

    // Sign-out function
    const signout = async () => {
        try {
            await axiosClient.post("/v1/manage/auth/logout");

            setToken(null);
            setUser(null);

            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }

            setIsAuthenticated(false);
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <AuthContext.Provider value={{ token, user, signin, signout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuthContext = () => {
    return useContext(AuthContext);
};
