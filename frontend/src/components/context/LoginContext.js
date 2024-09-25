    import React, { createContext, useState, useEffect } from "react";
    import { config } from "../../config/constants";

    export const LoginContext = createContext();

    export function LoginProvider({ children }) {
        
        const [token, setToken] = useState(null);
        const [user, setUser] = useState({});
        const [image, setImage] = useState(null);

        useEffect(() => {
            // Recuperar el token del localStorage al cargar la aplicación
            const storedToken = localStorage.getItem(config.SERVICE_TOKEN_NAME);
            if (storedToken) {
              setToken(storedToken);
            }
        
            // Recuperar el usuario del localStorage
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            }
        
            // Recuperar el avatar del localStorage
            const storedAvatar = localStorage.getItem("avatar");
            if (storedAvatar) {
              setImage(storedAvatar);
            }
          }, []);

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
