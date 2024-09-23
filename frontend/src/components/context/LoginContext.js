    import React, { createContext, useState } from "react";

    export const LoginContext = createContext();

    export function LoginProvider({ children }) {
        
        const [token, setToken] = useState(null);
        const [user, setUser] = useState({});
        const [image, setImage] = useState(null);

        return (
            <LoginContext.Provider value={{
                token,
                setToken,
                user,
                setUser,
                image, 
                setImage
            }}>
                {children}
            </LoginContext.Provider>
        );
    }
