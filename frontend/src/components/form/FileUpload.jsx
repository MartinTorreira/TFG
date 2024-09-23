import React, { useState, useRef } from "react";
import { FileUploadIcon } from "../../icons/FileUploadIcon";
import { DeleteImageIcon } from "../../icons/DeleteImageIcon";

const FileUpload = ({ onFileChange }) => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null); // Añadimos una referencia al input del archivo

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      onFileChange(selectedFile); // Asegúrate de manejar el archivo aquí
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      onFileChange(droppedFile); // Asegúrate de manejar el archivo aquí
    }
  };

  const handleRemove = () => {
    setFile(null);
    onFileChange(null); // Asegúrate de manejar el archivo nulo aquí
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reinicia el input del archivo
    }
  };

  return (
    <section className="flex flex-col w-full">
      <label
        htmlFor="email"
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        Avatar
      </label>
      <div
        className="flex flex-col items-center  w-full p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 h-32"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <FileUploadIcon size={36} color={"text-gray-600"} />

        <label
          htmlFor="fileInput"
          className="mt-3 cursor-pointer text-center text-sm font-light text-neutral-600"
        >
          {file
            ? file.name
            : <p className="text-gray-600">Arrastra y suelta la imagen o haz click<br></br> para seleccionar [.png, .svg, .jpeg, .jpg]</p>}
        </label>
        <input
          type="file"
          id="fileInput"
          ref={fileInputRef} 
          className="hidden"
          onChange={handleFileChange}
          accept=".png, .svg, .jpeg, .jpg"
        />
        {file && (
          <div className="relative mt-3">
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="w-12 h-12 object-cover rounded-full border border-neutral-300 dark:border-neutral-600"
            />
            <button
              onClick={handleRemove}
              className="absolute -top-1 -right-2 w-4 h-4 flex items-center justify-center hover:opacity-50"
            >
              <DeleteImageIcon/>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FileUpload;
