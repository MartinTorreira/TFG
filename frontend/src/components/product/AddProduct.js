import React, { useContext, useState } from "react";
import ButtonSubmit from "../form/ButtonSubmit";
import { CategoryDisplay } from "./CategoryDisplay";
import { LoginContext } from "../context/LoginContext";
import ProductImageUpload from "../form/ProductImageUpload";
import { uploadFile } from "../../firebase/config";
import { config } from "../../config/constants";
import { addProduct } from "../../backend/productService";

const AddProduct = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [isSubcategory, setIsSubcategory] = useState(false);

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(null);
  const [images, setImages] = useState([]);

  const { user } = useContext(LoginContext);

  const handleSubmitImages = (files) => {
    const imagesArray = Array.from(files);
    setImages(imagesArray);
  };

  const uploadImages = async () => {
    const uploadedImages = [];

    for (const image of images) {
      try {
        const result = await uploadFile(image);
        const fullPath = result.metadata.fullPath;
        const route = `https://firebasestorage.googleapis.com/v0/b/${config.FIREBASE_PROJECT}.appspot.com/o/${fullPath}?alt=media`;

        uploadedImages.push(route);
        console.log("Image subida: ", route);
      } catch (error) {
        console.log("Error al subir la imagen:", error);
      }
    }
    return uploadedImages;
  };

  const handleCategorySelect = (category) => {
    if (category.subcategoryIds.length === 0) {
      console.log("llego aqui", category.id);
      setCategory(category.id);
    } else return;
  };

  const onSuccess = () => {
    console.log("arriba espsña");
  };

  const onErrors = () => {
    console.log("gibraltar español");
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const imageList = await uploadImages();
    const product = {
      name,
      quantity,
      price,
      description,
      imageList,
      category,
    };

    addProduct(product, onSuccess, onErrors);
  };

  return (
    <section className="bg-white">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Vender producto
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Nombre del producto
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
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
                value={price}
                onChange={(e) => setPrice(e.target.value)}
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
              <CategoryDisplay onCategorySelect={handleCategorySelect} />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                id="description"
                rows="8"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Escribe la descripción del producto"
              ></textarea>
            </div>

            <div className="sm:col-span-2">
              <ProductImageUpload
                label={"Añadir fotos"}
                onFileChange={handleSubmitImages}
              />
            </div>
          </div>

          <div className="mt-10">
            <ButtonSubmit label={"Guardar"} dark={true} fn={handleSubmit} />
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddProduct;
