import React, { useState, useContext } from "react";
import { CategoryDisplay } from "./CategoryDisplay";
import ProductImageUpload from "../form/ProductImageUpload";
import { uploadFile } from "../../firebase/config";
import { config } from "../../config/constants";
import { addProduct } from "../../backend/productService";
import { validateAddProduct } from "../../utils/formValidations.js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LoginContext } from "../context/LoginContext";
import { QualityDisplay } from "./QualityDisplay";
import Map from "./maps/Map.js";

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
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const { token } = useContext(LoginContext);

  const navigate = useNavigate();

  const handleLocationSelect = (lat, lng) => {
    console.log("COORDENDAS", lat, lng);
    setLatitude(lat);
    setLongitude(lng);
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

    console.log("LOCATION" + latitude, longitude);
    const validationErrors = validateAddProduct(product);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      addProduct(product, onSuccess, onErrors);
      navigate("../home");
    }
  };

  return (
    <section className="mt-16 mb-20 ">
      <div className="flex flex-col items-center justify-start px-10 py-8 mx-auto lg:py-0">
        <div className="bg-gray-50 rounded-lg md:mt-0 w-full max-w-3xl xl:p-0 shadow-lg border border-gray-400">
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
                    Product Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm font-semibold rounded-lg focus:ring-accent focus:border-primary-600 block w-full p-2.5 placeholder:font-normal placeholder:italic"
                    placeholder="Enter product name"
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
                    Quantity
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
                    Price
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

                <div className="w-full flex flex-col">
                  <label
                    htmlFor="text"
                    className="block mb-2 text-sm text-gray-600"
                  >
                    Category/Subcategory
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
                    Quality
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
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    id="description"
                    rows="8"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm font-semibold rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder:font-normal placeholder:italic"
                    placeholder="Enter product description"
                  ></textarea>
                </div>

                <button
                  type="button"
                  onClick={openModal}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                  Open Map
                </button>
                {isOpen && (
                  <Map
                    isOpen={isOpen}
                    closeModal={closeModal}
                    onLocationSelect={handleLocationSelect}
                  />
                )}

                <div className="sm:col-span-2">
                  <ProductImageUpload
                    label={"Add Photos"}
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
                  className="w-full bg-gray-900 text-white border hover:opacity-90 transition all focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Añadir
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
