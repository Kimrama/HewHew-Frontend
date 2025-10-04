import * as SecureStore from 'expo-secure-store';
import { createContext, useEffect, useState } from "react";

type AuthContextType = {
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    authenticate: (token: string) => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
    token: null,
    isAuthenticated: false,
    isLoading: true,
    authenticate: () => {},
    logout: () => {},
});

export default function AuthContextProvider({ children }: { children: React.ReactNode }) {
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function loadToken() {
            try {
                const storedToken = await SecureStore.getItemAsync('token');
                if (storedToken) {
                    setAuthToken(storedToken);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.log('Error loading token:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadToken();
    }, []);

    const authenticate = (token: string) => {
        setAuthToken(token);
        setIsAuthenticated(true);
        SecureStore.setItemAsync('token', token);
    };

    const logout = () => {
        setAuthToken(null);
        setIsAuthenticated(false);
        SecureStore.deleteItemAsync('token');
    };

    const contextValue: AuthContextType = {
        token: authToken,
        isAuthenticated,
        isLoading,
        authenticate,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    )
}
