import React, { useState } from "react";
import { Avatar } from "@files-ui/react";

export default function AvatarChange({ onFileChange, avatar }) {
  const [imageSource, setImageSource] = useState(avatar);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChangeSource = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setImageSource(fileURL);
      setSelectedFile(file);
    }
  };

  const handleSubmitAvatar = () => {
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-white mb-2">
        Cambiar Avatar
        <img
          className="w-12 h-12 rounded-full ml-2"
          src={imageSource}
          alt="Rounded avatar"
        />
      </p>
      <input
        className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
        type="file"
        id="formFile"
        onChange={handleChangeSource}
      />
      <button
        onClick={handleSubmitAvatar}
        className="mb-2 mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Change Avatar
      </button>
    </div>
  );
}