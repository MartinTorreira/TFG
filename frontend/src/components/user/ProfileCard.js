import React, { useContext } from "react";
import { LoginContext } from "../context/LoginContext";

const ProfileCard = () => {
  const { token, user } = useContext(LoginContext);

  return (
    <div className="w-96 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="h-80 bg-gray-200 flex items-center justify-center">
        <img
          src={user.avatar}
          alt="profile-picture"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="text-center p-4">
        <h4 className="text-xl text-blue-gray-600 mb-2">{user.userName}</h4>
        <p className="text-blue-gray-500 font-medium">
          <span>
            <>
              {user.firstName}
              {user.lastName}
            </>
          </span>
        </p>
      </div>
      <div className="flex justify-center gap-7 pt-2 pb-4">
        <a href="#facebook" className="text-blue-500 hover:text-blue-700">
          <i className="fab fa-facebook" />
        </a>
        <a
          href="#twitter"
          className="text-light-blue-500 hover:text-light-blue-700"
        >
          <i className="fab fa-twitter" />
        </a>
        <a href="#instagram" className="text-purple-500 hover:text-purple-700">
          <i className="fab fa-instagram" />
        </a>
      </div>
    </div>
  );
};

export default ProfileCard;
