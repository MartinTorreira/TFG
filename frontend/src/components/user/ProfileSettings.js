import React, { useContext, useState } from "react";
import { LoginContext } from "../context/LoginContext";
import { uploadFile } from "../../firebase/config.js";
import { config } from "../../config/constants.js";
import { InputProfile } from "../form/InputProfile.jsx";
import ButtonSubmit from "../form/ButtonSubmit.jsx";
const ProfileSettings = () => {
  // ------ Context -----------------------------------------------
  const { user, image, setImage } = useContext(LoginContext);

  // ------ User Information ----------------------------------------
  const [userName, setUsername] = useState(user?.firstName);
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [email, setEmail] = useState(user?.email);

  // ------ User Password -------------------------------------------
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState("");
  const [oldPasswordConfirm, setOldPasswordConfirm] = useState("");
  const [userAvatar, setUserAvatar] = useState(user?.avatar);

  // ------ User Avatar ---------------------------------------------
  const [avatar, setAvatar] = useState("");

  const handleSubmitAvatar = async () => {
    const result = await uploadFile(avatar);
    const fullPath = result.metadata.fullPath;
    const route = `https://firebasestorage.googleapis.com/v0/b/${config.FIREBASE_PROJECT}.appspot.com/o/${fullPath}?alt=media`;

    setUserAvatar(route);
    localStorage.setItem("avatar", route);

    setImage(route);
  };

  const handleSubmit = () => {};

  return (
    <div className="flex flex-col items-center p-10 space-y-10">

      {/* Avatar */}
      <section className="w-2/3 aspect-w-1 aspect-h-1 p-6 rounded-lg shadow border border-gray-200">
        <h1 className=" text-left font-semibold text-4xl mb-6">Mi perfil</h1>
        <div className="flex flex-col items-center py-6">
          <div className="flex flex-col items-center mb-10 gap-2">
            <img
              src={user.avatar}
              alt="profile-picture"
              className="h-28 w-28 object-cover rounded-full mb-4"
            />
            <input
              className="relative block w-full rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out hover:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:bg-neutral-700 dark:focus:border-primary"
              type="file"
              accept=".jpeg, .png, .jpg, .svg"
              id="formFile"
              onChange={(e) => {
                handleSubmitAvatar(e.target.files[0]);
              }}
            />
          </div>
        </div>
      </section>

      {/* Datos personales */}
      <section className="w-2/3 aspect-w-1 aspect-h-1 p-6 rounded-lg shadow border border-gray-200">
        <h2 className="font-semibold text-2xl text-gray-400 mb-10">
          Datos personales
        </h2>
        <div className="flex justify-center w-full items-center gap-x-20">
          <div className="flex flex-col w-1/3 gap-y-4">
            <InputProfile
              placeholder={user.userName}
              label={"Username"}
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
            />
            <InputProfile
              placeholder={user.firstName}
              label={"Nombre"}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="flex flex-col w-1/3 gap-y-4 ">
            <InputProfile
              placeholder={user.lastName}
              label={"Apellidos"}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <InputProfile
              placeholder={user.email}
              label={"Email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end w-5/6 ml-10 mt-6"> 
          <ButtonSubmit
            label={"Guardar"}
            fn={() => handleSubmit()}
            dark={true}
          />
        </div>
      </section>

      {/* Cambiar contraseña */}
      <section className="w-2/3 aspect-w-1 aspect-h-1 p-6 rounded-lg shadow border border-gray-200">
        <h2 className="font-semibold text-2xl text-gray-400 mb-10  text-left">
          Cambiar contraseña
        </h2>
        <div className="flex justify-center w-full items-center gap-x-20">
          <div className="flex flex-col w-1/3 gap-y-4">
            <InputProfile
              placeholder={"***********"}
              label={"Contraseña actual"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />

            <InputProfile
              placeholder={"***********"}
              label={"Nueva contraseña"}
              value={oldPasswordConfirm}
              onChange={(e) => setOldPasswordConfirm(e.target.value)}
            />
          </div>

          <div className="flex flex-col w-1/3 gap-y-6">
            <InputProfile
              placeholder={"***********"}
              label={"Confirmar nueva contraseña"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className="py-3">
              <ButtonSubmit
                label={"Guardar"}
                fn={() => handleSubmit()}
                dark={true}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfileSettings;
