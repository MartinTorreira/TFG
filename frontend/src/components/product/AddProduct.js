import React, { useState } from "react";
import { CategoryDisplay } from "./CategoryDisplay";
import ProductImageUpload from "../form/ProductImageUpload";
import { uploadFile } from "../../firebase/config";
import { config } from "../../config/constants";
import { addProduct } from "../../backend/productService";
import { validateAddProduct } from "../../utils/formValidations.js";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(null);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    }
  };

  const onSuccess = () => {
    console.log("arriba espsña");
  };

  const onErrors = () => {
    console.log("gibraltar español");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    const imageList = await uploadImages();
    const product = {
      name,
      quantity,
      price,
      description,
      images: imageList,
      categoryDto: { id: category },
    };

    const validationErrors = validateAddProduct(product);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      addProduct(product, onSuccess, onErrors);
    }
  };

  return (
    <section className="mt-16">
      <div className="flex flex-col items-center justify-start px-10 py-8 mx-auto md:h-screen lg:py-0">
        <div className="bg-gray-50 rounded-lg shadow md:mt-0 w-full max-w-3xl xl:p-0 border ring-2 ring-gray-100">
          <div className="py-4 px-4 mx-auto max-w-2xl lg:py-10">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Vender producto
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm text-gray-600"
                  >
                    Nombre del producto
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm font-semibold rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder:font-normal placeholder:italic"
                    placeholder="Escribe el nombre del producto"
                    required
                  />
                  {isSubmitted && errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="item-weight"
                    className="block mb-2 text-sm text-gray-600"
                  >
                    Cantidad
                  </label>
                  <input
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    type="number"
                    min={"1"}
                    name="item-weight"
                    id="item-weight"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm font-semibold rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder:font-normal placeholder:italic"
                    placeholder="12"
                    required
                  />
                  {isSubmitted && errors.quantity && (
                    <p className="text-red-500 text-sm">{errors.quantity}</p>
                  )}
                </div>

                <div className="w-full">
                  <label
                    htmlFor="price"
                    className="block mb-2 text-sm text-gray-600"
                  >
                    Precio
                  </label>
                  <div className="relative">
                    <input
                      value={price}
                      onChange={(e) =>
                        setPrice(e.target.value.replace(",", "."))
                      }
                      type="number"
                      step="any"
                      name="price"
                      id="price"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm font-semibold rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pl-8 placeholder:font-normal placeholder:italic"
                      placeholder="14,99"
                      required
                    />
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-600">
                      €
                    </span>
                  </div>
                  {isSubmitted && errors.price && (
                    <p className="text-red-500 text-sm">{errors.price}</p>
                  )}
                </div>

                <div className="w-full flex flex-col">
                  <label
                    htmlFor="text"
                    className="block mb-2 text-sm text-gray-600"
                  >
                    Categoría/Subcategoría
                  </label>
                  <CategoryDisplay
                    onCategorySelect={(e) => handleCategorySelect(e)}
                  />
                  {isSubmitted && errors.category && (
                    <p className="text-red-500 text-sm">{errors.category}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm text-gray-600"
                  >
                    Descripción
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    id="description"
                    rows="8"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm font-semibold rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder:font-normal placeholder:italic"
                    placeholder="Escribe la descripción del producto"
                  ></textarea>
                </div>

                <div className="sm:col-span-2">
                  <ProductImageUpload
                    label={"Añadir fotos"}
                    onFileChange={handleSubmitImages}
                  />
                  {isSubmitted && errors.images && (
                    <p className="text-red-500 text-sm">{errors.images}</p>
                  )}
                </div>
              </div>

              <div className="mt-10">
                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white border hover:opacity-90 transition all focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddProduct;
