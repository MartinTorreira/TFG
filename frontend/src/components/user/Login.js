import React, { useContext, useState, useEffect } from "react";
import { login } from "../../backend/userService.js";
import { LoginContext } from "../context/LoginContext.js";
import { config } from "../../config/constants.js";
import { useNavigate } from "react-router-dom";
import { InputForm } from "../form/InputForm.jsx";
import { validateRegisterForm } from "../../utils/formValidations.js";
import { toast } from "sonner";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { setToken, setUser } = useContext(LoginContext);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const onErrors = () => {
    toast.error("Credenciales incorrectas");
  };

  const reauthenticationCallback = () => {
    console.log("reauthenticationCallback");
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const onSuccess = (authenticatedUser) => {
    setToken(authenticatedUser.serviceToken);
    setUser(authenticatedUser.user);

    localStorage.setItem(
      config.SERVICE_TOKEN_NAME,
      `Bearer ${authenticatedUser.serviceToken}`,
    );

    localStorage.setItem("user", JSON.stringify(authenticatedUser.user));
    localStorage.setItem("avatar", authenticatedUser.user.avatar);
    handleNavigate("/home");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    login(userName, password, onSuccess, onErrors, reauthenticationCallback);
  };

  // Actualizar errores cuando se intente enviar el formulario
  useEffect(() => {
    if (isSubmitting) {
      const validationErrors = validateRegisterForm({
        userName,
        password,
      });

      setErrors(validationErrors);

      // Resetear el estado para no revalidar en cada render
      setIsSubmitting(false);
    }
  }, [isSubmitting]);

  return (
    <section className="mt-20 w-full">
      <div className="flex flex-col items-center justify-start px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="bg-gray-50 rounded-lg shadow w-full max-w-lg xl:max-w-md p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
            Iniciar sesión
          </h1>
          <form className="space-y-4 md:space-y-6" action="#">
            <div className="mt-10">
              <InputForm
                label="Nombre de usuario"
                type="text"
                placeholder=""
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
                required={true}
              />
              {errors.userName && (
                <p className="text-red-500 text-sm">{errors.userName}</p>
              )}
            </div>

            <div>
              <InputForm
                label="Contraseña"
                type="password"
                placeholder="*************"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required={true}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  aria-describedby="terms"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                  required=""
                />
              </div>
            </div>

            <button
              onClick={handleLogin}
              type="submit"
              className="w-full bg-gray-900 text-white border hover:opacity-90 transition-all focus:ring-4 focus:outline-none focus:ring-accent-dark font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Iniciar sesión
            </button>

            <div className="flex justify-end text-center font-semibold underline">
              <a className="text-sm text-gray-500" href="/users/signUp">
                Registrarse{" "}
              </a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
