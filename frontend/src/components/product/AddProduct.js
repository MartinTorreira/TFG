import React, { useContext, useState } from "react";
import ButtonSubmit from "../form/ButtonSubmit";
import { CategoryDisplay } from "./CategoryDisplay";
import { LoginContext } from "../context/LoginContext";
import FileUpload from "../form/FileUpload.jsx";

const AddProduct = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [isSubcategory, setIsSubcategory] = useState(false);

  const { user } = useContext(LoginContext);

  // Definimos las categorías y subcategorías
  const categories = {
    Electronics: ["Mobile Phones", "Laptops", "Cameras"],
    Clothing: ["Men", "Women", "Children"],
    Home: ["Furniture", "Kitchen", "Garden"],
  };

  const handleOptionChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    // Verificamos si la opción seleccionada es una categoría o no
    setIsSubcategory(categories.hasOwnProperty(value));
  };

  const handleSubcategoryChange = (e) => {
    setSelectedOption(e.target.value);
    setIsSubcategory(false); // Regresar a mostrar categorías
  };

  const onSuccess = () => {};

  const onErrors = () => {};

  return (
    <section className="bg-white">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Vender producto
        </h2>
        <form action="#">
          <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Nombre del producto
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Escribe el nombre del producto"
                required
              />
            </div>
            <div>
              <label
                htmlFor="item-weight"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Cantidad
              </label>
              <input
                type="number"
                name="item-weight"
                id="item-weight"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="12"
                required
              />
            </div>

            <div className="w-full">
              <label
                htmlFor="price"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Precio
              </label>
              <input
                type="number"
                step="any"
                name="price"
                id="price"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="14,99€"
                required
              />
            </div>

            <div className="w-full flex flex-col">
              <label
                htmlFor="text"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Categoría/Subcategoría
              </label>
              <CategoryDisplay />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Descripción
              </label>
              <textarea
                id="description"
                rows="8"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Escribe la descripción del producto"
              ></textarea>
            </div>

            <div>
              <FileUpload
                label={"Añadir fotos"}
                onFileChange={handleSubmitImages}
              />
            </div>
          </div>

          <div className="mt-10">
            <ButtonSubmit label={"Guardar"} dark={true} />
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddProduct;
