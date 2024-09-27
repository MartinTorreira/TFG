import React, { useContext, useEffect } from "react";
import { LoginContext } from "./context/LoginContext";
import { config } from "../config/constants";
import { CardGrid } from "./CardGrid";

const Home = () => {
  let { token, setToken, setUser, user, image } = useContext(LoginContext);

  const avatar = user.avatar;

  useEffect(() => {
    const bearer = localStorage.getItem(config.SERVICE_TOKEN_NAME);
    const user = localStorage.getItem("user");

    if (bearer !== null) {
      setToken(bearer);
      setUser(JSON.parse(user));
    }
  }, [setToken, setUser]);

  return <CardGrid />;
};

export default Home;
