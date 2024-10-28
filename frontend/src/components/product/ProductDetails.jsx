import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ImageSlider } from "./ImageSlider.jsx";
import {
  addToFavorites,
  getProductById,
} from "../../backend/productService.js";
import { Badge } from "@radix-ui/themes";
import { qualities } from "../../utils/Qualities.js";
import useFavoriteStore from "../store/useFavoriteStore.js";
import ReadOnlyMap from "./maps/ReadOnlyMap.js";
import { Avatar } from "../Avatar.jsx";
import { toast } from "sonner";
import { RatingComponent } from "../RatingComponent.jsx";
import { LoginContext } from "../context/LoginContext.js";
import { DeleteIcon } from "../../icons/DeleteIcon.jsx";
import { EditIcon } from "../../icons/EditoIcon.jsx";
import { UpdateProductModal } from "../modals/UpdateProductModal.jsx";
import { Alert } from "./Alert.jsx";
import { deleteProduct } from "../../backend/productService.js";
import { removeFromFavorites } from "../../backend/productService.js";
import { BuyIcon } from "../../icons/BuyIcon.jsx";
import { ChatIcon } from "../../icons/ChatIcon.jsx";
import { MapPinIcon } from "../../icons/MapPinIcon.jsx";
import { UserIcon } from "../../icons/UserIcon.jsx";
import { CartIcon } from "../../icons/CartIcon.jsx";
import { CartIconFilled } from "../../icons/CartIconFilled.jsx";
import { getItemByProductId } from "../../backend/shoppingCartService.js";
import useCartStore from "../store/useCartStore.js";
import useChatStore from "../store/useChatStore.js";

const ProductDetails = ({ setChatVisible, setSelectedConversationId }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addFavorite, removeFavorite, isFavorite } = useFavoriteStore();
  const [label, setLabel] = useState("");
  const [color, setColor] = useState("");
  const favorite = isFavorite(product?.id);

  const { user, token } = useContext(LoginContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const { addToCart, removeFromCart, loadCart, isAdded } = useCartStore();
  const isProductAdded = isAdded(product?.id);
  const navigate = useNavigate();

  const { addConversation } = useChatStore();

  useEffect(() => {
    loadCart();
  }, [isAdded]);

  const handleChatClick = () => {
    if (!product.userDto) {
      console.error("User DTO is undefined. Cannot initiate chat.");
      return;
    }
    const receiverId = product.userDto.id;
    const conversationId = [user.id, receiverId].sort().join("-");
    addConversation(conversationId);
    setChatVisible(true);
    setSelectedConversationId(conversationId);
  };

  function getQualityData(quality) {
    const qualityItem = qualities.find((item) => item.value === quality);

    if (qualityItem) {
      setLabel(qualityItem.label);
      setColor(qualityItem.color);
    } else {
      setLabel("Desconocido");
      setColor("gray");
    }
  }

  const handleBuyClick = () => {
    navigate("/product/order-summary", { state: { productList: [product] } });
  };

  const handleEditClick = (e) => {
    setIsModalOpen(true);
  };

  const handleDeleteClick = () => {
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteProduct(
      product.id,
      () => {
        removeFavorite(product.id);
      },
      (errors) => {
        console.log(errors);
      },
    );

    toast.success("Producto eliminado correctamente");
    setIsAlertOpen(false);
    navigate("../home");
  };

  const handleCartClick = (productId) => {
    if (!token) {
      navigate("../users/login");
    } else {
      if (!isProductAdded) {
        addToCart(
          productId,
          1,
          () => {},
          (errors) => {
            console.log(errors);
          },
        );
      } else {
        getItemByProductId(
          productId,
          (itemId) => removeFromCart(itemId),
          (error) => console.log(error),
        );
      }
    }
  };

  const handleFavoriteClick = (e) => {
    if (!token) {
      navigate("../users/login");
    } else {
      const favoriteId = product.id;

      if (!favorite) {
        addToFavorites(
          favoriteId,
          (newFavorite) => {
            addFavorite(newFavorite);
          },
          (errors) => {
            console.log(errors);
          },
        );
      } else {
        removeFromFavorites(
          favoriteId,
          () => {
            removeFavorite(favoriteId);
          },
          (errors) => {
            console.log(errors);
          },
        );
      }
    }
  };

  useEffect(() => {
    if (product) {
      getQualityData(product.quality);
    }
  }, [product]);

  const onSuccess = (data) => {
    setProduct(data);
  };

  const onErrors = (error) => {
    toast.error("Error", error);
  };

  useEffect(() => {
    const productId = Number(id);
    getProductById(productId, onSuccess, onErrors);
  }, [id, setProduct]);

  if (!product) return null;

  return (
    <section className="py-8 bg-transparent md:py-16 dark:bg-gray-900 antialiased">
      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
          <div className="shrink-0 max-w-md lg:max-w-lg">
            <div className="flex flex-col gap-y-4">
              <ImageSlider images={product.images} />
              {user.id !== product.userDto.id ? (
                <section className="flex flex-row sm:flex-row space-x-0 sm:space-x-2 space-y-2 sm:space-y-0 sm:justify-center md:justify-start ">
                  <button
                    onClick={() => handleFavoriteClick(product.id)}
                    className="flex w-full sm:w-1/4 items-center justify-center py-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-800 hover:border-gray-300 transition-all"
                  >
                    <span className="flex flex-row items-center space-x-2">
                      <svg
                        className="w-5 h-5 transition-all"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill={`${favorite ? "red" : "none"}`}
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke={`${favorite ? "red" : "currentColor"}`}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                        />
                      </svg>
                      <p className="text-base">
                        {favorite ? "Me gusta" : "Añadir"}
                      </p>
                    </span>
                  </button>
                  <button
                    onClick={handleChatClick}
                    className="flex w-full sm:w-1/4 items-center justify-center py-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-800 hover:border-gray-300 transition-all"
                  >
                    <span className="flex flex-row items-center space-x-2">
                      <ChatIcon className="w-5 h-5" />
                      <p className="text-base">Chatear</p>
                    </span>
                  </button>
                </section>
              ) : null}
            </div>
          </div>

          <div className="mt-6 sm:mt-8 lg:mt-0 text-center lg:text-left sm:flex sm:flex-col">
            <div className="flex sm:flex-col lg:flex-row items-center  sm:gap-x-6 lg:gap-x-4 sm:items-center">
              <h1 className="text-xl font-montserrat font-semibold text-gray-900 sm:text-2xl dark:text-white">
                {product.name}
              </h1>
              <Badge color={color} className="text-xs rounded">
                {label}
              </Badge>
            </div>
            <div className="mt-4 sm:items-center sm:gap-4 sm:flex sm:flex-col lg:flex-row">
              <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                {product.price.toFixed(2).replace(".", ",")}
                {"€"}
              </p>
            </div>
            {user.id !== product.userDto.id ? (
              <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:flex-col lg:flex-row sm:mt-8">
                <button
                  onClick={handleBuyClick}
                  className="flex items-center justify-center py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-800 hover:border-gray-300 focus:z-10 focus:ring-4 focus:ring-gray-100 transition-all"
                >
                  <span className="flex flex-row gap-x-2">
                    <BuyIcon size="20" />
                    Comprar ahora
                  </span>
                </button>
                <button
                  onClick={() => handleCartClick(product.id)}
                  title={
                    isProductAdded ? "Quitar del carro" : "Añadir al carro"
                  }
                  className="flex items-center justify-center py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-800 hover:border-gray-300 transition-all"
                >
                  {isProductAdded ? (
                    <a className="flex flex-row space-x-2">
                      <CartIconFilled size={20} />
                      <span>Quitar del carro</span>
                    </a>
                  ) : (
                    <a className="flex flex-row space-x-2">
                      <CartIcon size={20} />
                      <span>Añadir al carro</span>
                    </a>
                  )}
                </button>
              </div>
            ) : (
              <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:flex-col lg:flex-row sm:mt-8">
                <button
                  onClick={() => handleEditClick(product.id)}
                  className="flex items-center justify-center py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-800 hover:border-gray-300 focus:z-10 focus:ring-4 focus:ring-gray-100 transition-all"
                >
                  <EditIcon size={20} color={"text-black -ml-2 mr-2"} />
                  Editar
                </button>

                <button
                  onClick={() => handleDeleteClick(product.id)}
                  className="text-white mt-4 sm:mt-0 bg-red-800 hover:opacity-80 transition-all font-medium rounded-lg text-sm px-5 py-2.5 flex items-center justify-center"
                >
                  <DeleteIcon size={20} color={"text-white -ml-2 mr-2"} />
                  Eliminar
                </button>
              </div>
            )}
            <hr className="my-6 sm:my-8 border-gray-400" />
            <h3 className="mb-4 text-lg font-semibold text-gray-700">
              {product.categoryDto.name}
            </h3>
            <p className="mb-6 text-gray-800 font-lato text-lg ">
              {product.description}
            </p>
          </div>

          <div className="lg:col-span-2 w-full justify-center items-center mt-20">
            <label className="flex flex-row text-xl font-semibold space-x-3">
              <MapPinIcon size={20} color={"text-black -ml-2 mr-2"} />
              <p>Ubicación del producto</p>
            </label>
            <div className="mt-4">
              <ReadOnlyMap lat={product.latitude} lng={product.longitude} />
            </div>
          </div>

          <div className="lg:col-span-2 w-full justify-center items-center mt-10">
            <label className="flex flex-row text-xl font-semibold space-x-2 mb-10 ">
              <UserIcon size={"30"} />
              <p>Vendedor</p>
            </label>
            <div className="flex flex-row items-center">
              <Avatar
                size={"16"}
                className=""
                imagePath={product.userDto.avatar}
              />
              <div className="flex flex-col gap-y-1 ml-2">
                <p className="ml-1">{product.userDto.userName}</p>
                <RatingComponent rate={product.userDto.rate} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <UpdateProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <Alert
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
};

export default ProductDetails;
