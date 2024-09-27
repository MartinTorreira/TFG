import React, { useState, useEffect, useContext } from "react";
import { signUp } from "../../backend/userService.js";
import { useNavigate } from "react-router-dom";
import { InputForm } from "../form/InputForm.jsx";
import { validateRegisterForm } from "../../utils/formValidations.js";
import { toast } from "sonner";
import { LoginContext } from "../context/LoginContext.js";
import { uploadFile } from "../../firebase/config.js";
import { config } from "../../config/constants.js";
import FileUpload from "../form/FileUpload.jsx";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const { setImage } = useContext(LoginContext);
  const [avatar, setAvatar] = useState(null);

  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");

  // Estado para disparar la validación
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fileList, setFileList] = useState([]);

  const navigate = useNavigate();

  function getParams() {
    const user = {
      userName,
      password,
      firstName,
      lastName,
      email,
      rate: "0",
      role: "1",
      avatar,
    };
    return user;
  }

  const onSuccess = () => {
    setImage(avatar);
    toast.success("Cuenta creada correctamente");
    navigate("/users/login");
  };

  const onErrors = (error) => {
    if (
      error.globalError &&
      error.globalError.includes("DuplicateInstanceException")
    ) {
      toast.error("Nombre de usuario ya registrado");
    } else if (
      error.globalError &&
      error.globalError.includes("DuplicateEmailException")
    ) {
      toast.error("Correo ya registrado");
    }
  };

  const reauthenticationCallback = () => {
    toast.error("Error de autenticación");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    const validationErrors = validateRegisterForm({
      userName,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const user = getParams();

      // Si no hay avatar, establece uno por defecto
      if (!avatar) {
        user.avatar = `https://ui-avatars.com/api/?name=${user.userName}`;
      } else {
        user.avatar = avatar; // Usar el avatar subido si está disponible
      }

      signUp(user, onSuccess, onErrors, reauthenticationCallback);
    }
  };

  // Actualizar errores cuando se intente enviar el formulario
  useEffect(() => {
    if (isSubmitting) {
      const validationErrors = validateRegisterForm({
        userName,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });

      setErrors(validationErrors);

      // Resetear el estado para no revalidar en cada render
      setIsSubmitting(false);
    }
  }, [isSubmitting]);

  const handleSubmitAvatar = async (file) => {
    if (!file) {
      return;
    }

    try {
      const result = await uploadFile(file);
      const fullPath = result.metadata.fullPath;
      const route = `https://firebasestorage.googleapis.com/v0/b/${config.FIREBASE_PROJECT}.appspot.com/o/${fullPath}?alt=media`;

      // Guardar avatar en el localStorage y actualizar el estado
      localStorage.setItem("avatar", route);
      setAvatar(route);
      console.log("Avatar guardado:", route);
    } catch (error) {
      console.error("Error al subir el avatar:", error);
    }
  };

  return (
    <section className="mt-20">
      <div className="flex flex-col items-center justify-start px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="bg-gray-50 rounded-lg shadow md:mt-0 w-lg xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Crear una cuenta
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              <div className="mt-10">
                <InputForm
                  label="Nombre de usuario *"
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

              <div className="flex flex-row gap-x-4">
                <div>
                  <InputForm
                    label="Nombre *"
                    type="text"
                    placeholder=""
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                    required={true}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <InputForm
                    label="Apellidos *"
                    type="text"
                    placeholder=""
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                    required={true}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <InputForm
                  label="Email *"
                  type="email"
                  placeholder="example@example.example"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  required={true}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div>
                <InputForm
                  label="Contraseña *"
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

              <div>
                <InputForm
                  label="Confirmar constraseña *"
                  type="password"
                  placeholder="*************"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                  required={true}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex">
                <FileUpload
                  onFileChange={handleSubmitAvatar}
                  label={"Avatar"}
                />
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
                onClick={handleRegister}
                type="submit"
                className="w-full text-black bg-gray-200 border hover:border-gray-900 transition all focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Crear cuenta
              </button>
              <div className="flex justify-end text-center font-semibold underline">
                <a className="text-sm text-gray-500" href="/users/login">
                  Iniciar sesión{" "}
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
