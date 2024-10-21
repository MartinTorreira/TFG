import React, { useContext, useState, useEffect } from "react";
import { LoginContext } from "../context/LoginContext";
import { uploadFile } from "../../firebase/config.js";
import { config } from "../../config/constants.js";
import { InputProfile } from "../form/InputProfile.jsx";
import ButtonSubmit from "../form/ButtonSubmit.jsx";
import { changeAvatar, updateProfile } from "../../backend/userService.js";
import { changePassword } from "../../backend/userService.js";
import { toast } from "sonner";
import { EditIcon } from "../../icons/EditoIcon.jsx";
import { setReauthenticationCallback } from "../../backend/appFetch.js";


const ProfileSettings = () => {
  // ------ Context -----------------------------------------------
  const { user, updateUserAvatar } = useContext(LoginContext);

  // ------ User Information ----------------------------------------
  const [userName, setUsername] = useState(user?.userName || "");
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");

  // ------ User Password -------------------------------------------
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  // ------ User Avatar ---------------------------------------------
  const [avatar, setAvatar] = useState(null);
  const [userAvatar, setUserAvatar] = useState(user?.avatar || "");

  // ------ Errors & Validation -------------------------------------
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const onSuccess = () => {
    toast.success("Datos actualizados");
  };

  const onErrors = (error) => {
    console.log("ERROR" + error.globalError);
    if (
      error.globalError &&
      error.globalError.includes("DuplicateEmailException")
    ) {
      toast.error("Correo ya registrado");
    } else if (
      error.globalError &&
      error.globalError.includes("IncorrectPasswordException")
    ) {
      toast.error("Contraseña actual incorrecta");
    }
  };

  const reauthenticationCallback = () => {
    toast.error("Reauthenticate");
  };

  // Cambiar datos personales y/o avatar
  const handleUpdateProfile = async () => {
    let avatarUrl = userAvatar;

    if (avatar) {
      const result = await uploadFile(avatar);
      const fullPath = result.metadata.fullPath;
      avatarUrl = `https://firebasestorage.googleapis.com/v0/b/${config.FIREBASE_PROJECT}.appspot.com/o/${fullPath}?alt=media`;

      setUserAvatar(avatarUrl);
      updateUserAvatar(avatarUrl);
    //  changeAvatar(user.id, avatarUrl, () => {}, onErrors);

    }

    const updatedUser = {
      id: user.id,
      userName,
      firstName,
      lastName,
      email,
      avatar: avatarUrl,
    };

    updateProfile(
      updatedUser,
      () => {
        onSuccess();
        localStorage.setItem("user", JSON.stringify(updatedUser));
      },
      onErrors,
    );
  };

  const handleChangePassword = () => {
    if (newPassword !== newPasswordConfirm) {
      setErrors({ ...errors, password: "Las contraseñas no coinciden" });
      return;
    }
    changePassword(
      user.id,
      oldPassword,
      newPassword,
      onSuccess,
      onErrors,
      reauthenticationCallback,
    );
  };

  const handleChangeAvatar = async(files) => {
    const avatar = files[0];
    setAvatar(avatar);
    const result = await uploadFile(avatar);
		const fullPath = result.metadata.fullPath;
		const route = `https://firebasestorage.googleapis.com/v0/b/${config.FIREBASE_PROJECT}.appspot.com/o/${fullPath}?alt=media`;

		setUserAvatar(route);
		localStorage.setItem("avatar", route);

		changeAvatar(user.id, route, () => {console.log("Avatar cambiado con éxito")}, onErrors);
  }

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUsername(storedUser.userName || "");
      setFirstName(storedUser.firstName || "");
      setLastName(storedUser.lastName || "");
      setEmail(storedUser.email || "");
      setUserAvatar(storedUser.avatar || "");
    }
  }, []);

  const validateEmail = (email) => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      return <p className="text-red-500 text-sm">El email no es válido</p>;
    }
  };

  const handleButtonClick = () => {
    document.getElementById("formFile").click();
  };

  return (
    <div className="flex flex-col items-center p-10 space-y-10 mx-auto max-w-6xl">
      {/* Avatar y Datos públicos */}
      <section className="w-full p-6 rounded-lg shadow-md bg-gray-50 border border-gray-200">
        <h2 className="font-semibold text-2xl text-gray-800 mb-10 text-center">
          Datos públicos
        </h2>

        {/* Avatar centralizado */}
        <div className="flex justify-center items-center py-6">
          <div className="flex flex-col items-center gap-2">
            <input
              className="hidden"
              type="file"
              accept=".jpeg, .png, .jpg, .svg"
              id="formFile"
              onChange={(e) => handleChangeAvatar(e.target.files)}
            />
            <button
              className="relative block w-full max-w-xs rounded group"
              onClick={handleButtonClick}
            >
              <div className="relative h-28 w-28 mb-4">
                <img
                  src={userAvatar || user.avatar}
                  alt="profile-picture"
                  className="h-full w-full object-cover rounded-full border border-gray-800 transition-all duration-300 group-hover:brightness-50 group-hover:opacity-20"
                />
                <div className="absolute inset-0 flex justify-center items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-dark text-lg font-semibold">Cambiar</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Datos personales */}
        <div className="mt-2 flex flex-col lg:grid lg:grid-cols-2 gap-y-6 px-40">
          <div className="flex justify-center">
            <InputProfile
              label={"Username"}
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
              icon={true}
              placeholder={userName}
              edit={true}
            />
            {errors.userName && (
              <p className="text-red-500 font-bold text-sm">
                {errors.userName}
              </p>
            )}
          </div>
          <div className="flex justify-center">
            <InputProfile
              label={"Nombre"}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              icon={true}
              placeholder={firstName}
              edit={true}
            />
          </div>
          <div className="flex justify-center">
            <InputProfile
              label={"Apellidos"}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              icon={true}
              placeholder={lastName}
              edit={true}
            />
            {errors.lastName && (
              <p className="text-red-500 font-bold text-sm">
                {errors.userName}
              </p>
            )}
          </div>
          <div className="flex justify-center">
            <div>
              <InputProfile
                label={"Email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={true}
                placeholder={email}
                edit={true}
              />
              <div className="flex font-bold">{validateEmail(email)}</div>
            </div>
          </div>
        </div>

        {/* Botón guardar */}
        <div className="flex justify-end w-full mt-6">
          <ButtonSubmit
            label={"Guardar"}
            fn={handleUpdateProfile}
            dark={true}
          />
        </div>
      </section>

      {/* Cambiar contraseña */}
      <section className="w-full p-6 rounded-lg shadow-md bg-gray-50 border border-gray-200">
        <h2 className="font-semibold text-2xl text-gray-800 mb-16 text-center">
          Cambiar contraseña
        </h2>

        {/* Campos de contraseña */}
        <div className="mt-10 flex flex-col lg:grid lg:grid-cols-2 gap-y-6 px-40 ">
          <div className="flex justify-center">
            <InputProfile
              label={"Contraseña actual"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              type={"password"}
            />
          </div>
          <div className="flex justify-center">
            <InputProfile
              label={"Nueva contraseña"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type={"password"}
            />
          </div>
          <div className="flex justify-center">
            <div>
              <InputProfile
                label={"Confirmar nueva contraseña"}
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                type={"password"}
              />

              {errors.password && (
                <p className="text-red-500 font-bold text-sm">
                  {errors.password}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Botón guardar contraseña */}
        <div className="flex justify-end w-full mt-6">
          <ButtonSubmit
            label={"Guardar"}
            fn={handleChangePassword}
            dark={true}
          />
        </div>
      </section>
    </div>
  );
};

export default ProfileSettings;
