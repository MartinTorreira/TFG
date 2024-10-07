import React, { useState, useRef } from "react";
import { CategoryDisplay } from "../product/CategoryDisplay";
import { uploadFile } from "../../firebase/config";
import { config } from "../../config/constants";
import { updateProduct } from "../../backend/productService";
import { validateAddProduct } from "../../utils/formValidations.js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { QualityDisplay } from "../product/QualityDisplay";
import UpdateFileUpload from "../form/UpdateFileUpload.jsx";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

const options = {
  scrollwheel: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
};

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 43.45,
  lng: -80.49,
};

export const UpdateProductModal = ({ product, isOpen, onClose }) => {
  const [name, setName] = useState(product?.name || "");
  const [quantity, setQuantity] = useState(product.quantity);
  const [price, setPrice] = useState(product.price);
  const [description, setDescription] = useState(product.description);
  const [category, setCategory] = useState(product.categoryDto.id);
  const [quality, setQuality] = useState(product.quality);
  const [latitude, setLatitude] = useState(product.latitude);
  const [longitude, setLongitude] = useState(product.longitude);
  const [images, setImages] = useState(product.images || []);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selected, setSelected] = useState({
    lat: product.latitude,
    lng: product.longitude,
  });
  const navigate = useNavigate();
  const mapRef = useRef();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyC3DouYAkc3zzgNFpRiouHVw2fMChNSnJw",
    libraries: ["places"],
  });

  const handleSubmitImages = (files) => {
    setImages(files);
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setLatitude(lat);
    setLongitude(lng);
    setSelected({ lat, lng });
    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
    }
  };

  const handleCategorySelect = (event, category) => {
    event.preventDefault();
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
    toast.success("Product updated successfully");
  };

  const onErrors = () => {
    toast.error("Failed to update product");
  };

  const handleSubmit = async (event) => {
    setIsSubmitted(true);
    const imageList = await uploadImages();
    const productDto = {
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

    const validationErrors = validateAddProduct(productDto);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      updateProduct(product.id, productDto, onSuccess, onErrors);
      onClose();
      navigate("../home");
    }
  };

  const uploadImages = async () => {
    const uploadedImages = [];
    for (const image of images) {
      if (typeof image === "string") {
        uploadedImages.push(image);
      } else {
        try {
          const result = await uploadFile(image);
          const fullPath = result.metadata.fullPath;
          const route = `https://firebasestorage.googleapis.com/v0/b/${config.FIREBASE_PROJECT}.appspot.com/o/${fullPath}?alt=media`;
          uploadedImages.push(route);
        } catch (error) {
          console.log("Error uploading image:", error);
        }
      }
    }
    return uploadedImages;
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onClose}
        isDismissable={false}
        scrollBehavior="inside"
      >
        <ModalContent style={{ width: "90%", maxWidth: "800px" }}>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Editar producto
              </ModalHeader>
              <ModalBody className="max-h-[70vh] overflow-y-auto">
                <section className="mb-10 -mt-10">
                  <div className="flex flex-col items-center justify-start px-10 py-8 mx-auto lg:py-0">
                    <div className="rounded-lg md:mt-0 w-full max-w-3xl xl:p-0">
                      <div className="py-4 px-4 mx-auto max-w-2xl lg:py-10">
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
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm font-semibold rounded-lg focus:ring-accent focus:border-primary-600 block w-full p-2.5 placeholder:font-medium placeholder:italic"
                                placeholder="Nombre del producto"
                                required
                              />
                              {isSubmitted && errors.name && (
                                <p className="text-red-500 text-sm">
                                  {errors.name}
                                </p>
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
                                value={quantity === 0 ? "" : quantity}
                                onChange={(e) =>
                                  setQuantity(Number(e.target.value))
                                }
                                type="number"
                                min={"1"}
                                name="item-weight"
                                id="item-weight"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm font-semibold rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder:font-medium placeholder:italic"
                                placeholder="Cantidad"
                                required
                              />
                              {isSubmitted && errors.quantity && (
                                <p className="text-red-500 text-sm">
                                  {errors.quantity}
                                </p>
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
                                  value={price === 0 ? "" : price}
                                  onChange={(e) =>
                                    setPrice(e.target.value.replace(",", "."))
                                  }
                                  type="number"
                                  step="any"
                                  name="price"
                                  id="price"
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm font-semibold rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pl-8 placeholder:font-medium placeholder:italic"
                                  placeholder="Precio"
                                  required
                                />
                                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-600">
                                  €
                                </span>
                              </div>
                              {isSubmitted && errors.price && (
                                <p className="text-red-500 text-sm">
                                  {errors.price}
                                </p>
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
                                onCategorySelect={(event, category) =>
                                  handleCategorySelect(event, category)
                                }
                              />
                              {isSubmitted && errors.category && (
                                <p className="text-red-500 text-sm">
                                  {errors.category}
                                </p>
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
                              {isSubmitted && errors.quality && (
                                <p className="text-red-500 text-sm">
                                  {errors.quality}
                                </p>
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
                                value={description === 0 ? "" : description}
                                onChange={(e) => setDescription(e.target.value)}
                                id="description"
                                rows="8"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm font-semibold rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder:font-medium placeholder:italic"
                                placeholder="Introduce una nueva descripción del producto"
                                required
                              />
                              {isSubmitted && errors.description && (
                                <p className="text-red-500 text-sm">
                                  {errors.description}
                                </p>
                              )}
                            </div>

                            <div className="sm:col-span-2 mt-4">
                              <div className="space-y-3">
                                <label
                                  htmlFor="description"
                                  className="block mb-2 text-sm text-gray-600"
                                >
                                  {" "}
                                  Cambiar ubicación
                                </label>
                                <PlacesAutocomplete setSelected={setSelected} />
                                <GoogleMap
                                  mapContainerStyle={containerStyle}
                                  zoom={10}
                                  center={selected || center}
                                  onClick={handleMapClick}
                                  onLoad={(map) => (mapRef.current = map)}
                                  options={options}
                                >
                                  {selected && <MarkerF position={selected} />}
                                </GoogleMap>
                              </div>
                            </div>

                            <div className="flex flex-col w-max mt-4">
                              <label
                                htmlFor="description"
                                className="block mb-2 text-sm text-gray-600"
                              >
                                {" "}
                                Cambiar imágenes
                              </label>
                              <UpdateFileUpload
                                onFileChange={handleSubmitImages}
                                images={images}
                                className="w-full"
                              />
                              {isSubmitted && errors.images && (
                                <p className="text-red-500 text-sm">
                                  {errors.images}
                                </p>
                              )}
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </section>
              </ModalBody>
              <ModalFooter>
                <Button auto onClick={handleSubmit}>
                  Actualizar producto
                </Button>
                <Button flat onClick={onClose}>
                  Cancelar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

const PlacesAutocomplete = ({ setSelected }) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setSelected({ lat, lng });
  };

  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm font-semibold rounded-lg focus:ring-accent focus:border-primary-600 block w-full p-2.5 placeholder:font-medium placeholder:italic"
        placeholder="Buscar una dirección"
      />
      <ComboboxPopover style={{ zIndex: 1000 }}>
        {" "}
        {/* Ajustar el z-index */}
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption
                key={place_id}
                value={description}
                className="cursor-pointer hover:bg-gray-200"
              />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};
