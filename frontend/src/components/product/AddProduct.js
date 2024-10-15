import React, { useState, useContext } from "react";
import { CategoryDisplay } from "./CategoryDisplay";
import ProductImageUpload from "../form/ProductImageUpload";
import { uploadFile } from "../../firebase/config";
import { config } from "../../config/constants";
import { addProduct } from "../../backend/productService";
import { validateAddProduct } from "../../utils/formValidations.js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { QualityDisplay } from "./QualityDisplay";
import Map from "./maps/Map.js";
import { GoogleMap, MarkerF } from "@react-google-maps/api";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(null);
  const [quality, setQuality] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const navigate = useNavigate();

  const handleLocationSelect = (lat, lng) => {
    setLatitude(lat);
    setLongitude(lng);
    setSelected({ lat, lng });
    closeModal();
  };

  const handleSubmitImages = (files) => {
    setImages(files);
  };

  const uploadImages = async () => {
    const uploadedImages = [];
    for (const image of images) {
      try {
        const result = await uploadFile(image);
        const fullPath = result.metadata.fullPath;
        const route = `https://firebasestorage.googleapis.com/v0/b/${config.FIREBASE_PROJECT}.appspot.com/o/${fullPath}?alt=media`;
        uploadedImages.push(route);
        console.log("Image uploaded: ", route);
      } catch (error) {
        console.log("Error uploading image:", error);
      }
    }
    return uploadedImages;
  };

  const handleCategorySelect = (category) => {
    if (category.subcategoryIds.length === 0) {
      setCategory(category.id);
    }
  };

  const handleQualitySelect = (quality) => {
    if (quality !== null) {
      setQuality(quality);
    }
  };

  const onSuccess = () => {
    toast.success("Product added successfully");
  };

  const onErrors = () => {
    toast.error("Failed to add product");
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
      quality,
      latitude,
      longitude,
    };

    const validationErrors = validateAddProduct(product);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      addProduct(product, onSuccess, onErrors);
      navigate("../home");
    }
  };

  return (
    <section className="mt-10 mb-20">
      <div className="flex flex-col items-center justify-start px-10 py-8 mx-auto lg:py-0">
        <div className="rounded-lg md:mt-0 w-1/2 xl:p-0 ">
          <div className="py-4 px-20 mx-auto w-full lg:py-10">
            <form onSubmit={handleSubmit}>
              {/* Section 1: Product Name, Quantity, Price */}
              <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <h2 className="text-lg font-semibold mb-6">
                  Detalles del producto
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:gap-6">
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
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm font-semibold rounded-lg focus:ring-accent focus:border-primary-600 block w-full p-2.5 placeholder:font-normal placeholder:italic"
                      placeholder="Introduce el nombre..."
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
                        placeholder="14.99"
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
                </div>
              </div>

              {/* Section 2: Category, Quality, Description */}
              <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <h2 className="text-lg font-semibold mb-6">
                  Información específica{" "}
                </h2>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6">
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

                  <div className="w-full flex flex-col">
                    <label
                      htmlFor="text"
                      className="block mb-2 text-sm text-gray-600"
                    >
                      Calidad
                    </label>
                    <QualityDisplay
                      onQualitySelect={(e) => handleQualitySelect(e)}
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
                      placeholder="Introduce la descripción de tu anuncio..."
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Section 3: Map */}
              <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <h2 className="text-lg font-semibold mb-6">
                  Ubicación del producto{" "}
                </h2>
                <button
                  type="button"
                  onClick={openModal}
                  className="px-4 py-2 bg-black text-white rounded hover:opacity-80 transition-all"
                >
                  Abir mapa
                </button>
                {isOpen && (
                  <Map
                    isOpen={isOpen}
                    closeModal={closeModal}
                    onLocationSelect={handleLocationSelect}
                    selected={selected}
                    setSelected={setSelected}
                  />
                )}
                {selected && (
                  <div className="mt-4">
                    <GoogleMap
                      mapContainerStyle={{ width: "100%", height: "200px" }}
                      zoom={10}
                      center={selected}
                    >
                      <MarkerF position={selected} />
                    </GoogleMap>
                  </div>
                )}
              </div>

              {/* Section 4: Photos */}
              <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <h2 className="text-lg font-semibold mb-6">Añadir fotos </h2>
                <div className="sm:col-span-2">
                  <ProductImageUpload
                    label={"Escoge fotos para tu publicación"}
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
                  className="w-full bg-accent-darker text-white border border-accent-ligth hover:opacity-90 transition all focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg px-5 py-2.5 text-center"
                >
                  Publicar anuncio
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
