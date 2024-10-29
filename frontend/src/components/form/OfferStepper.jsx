import React, { useContext, useState, useEffect } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import { getProductsByUserId } from "../../backend/productService";
import { LoginContext } from "../context/LoginContext";

const steps = ["Escoger producto(s)", "Establecer precio", "Envíar oferta"];

export default function OfferStepper({ onOfferFinalize }) {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [desiredPrice, setDesiredPrice] = useState(0);
  const { user } = useContext(LoginContext);

  useEffect(() => {
    if (activeStep === 0 && user?.id) {
      getProductsByUserId(
        user.id,
        { page: 0, size: 10 },
        (data) => setProducts(data.content),
        (error) => console.log("Error fetching products", error),
      );
    }
  }, [activeStep, user]);

  const handleQuantityChange = (productId, value) => {
    const newQuantities = {
      ...quantities,
      [productId]: value,
    };
    setQuantities(newQuantities);

    const newTotalPrice = products.reduce((acc, product) => {
      return acc + (newQuantities[product.id] || 0) * product.price;
    }, 0);
    setTotalPrice(newTotalPrice);
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return products.length > 0 ? (
          <div className="flex flex-col gap-4">
            {products.length > 0 ? products.map((product) => (
              <div
                key={product.id}
                className="border p-4 flex items-center rounded-lg shadow-sm"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-14 h-14 object-cover mr-4 rounded border"
                />
                <div className="flex flex-col flex-grow">
                  <h5 className="text-lg font-semibold">{product.name}</h5>
                  <p className="text-gray-600">
                    {product.price?.toFixed(2).replace(".", ",")}
                    {" €"}
                  </p>
                </div>
                <input
                  type="number"
                  min="0"
                  max={product.quantity}
                  value={quantities[product.id] || 0}
                  onChange={(e) =>
                    handleQuantityChange(
                      product.id,
                      Math.min(Math.max(e.target.value, 0), product.quantity),
                    )
                  }
                  className="w-16 p-2 border rounded ml-4"
                />
              </div>
            )): null}
            <div className="text-right font-semibold">
              Precio Total: {totalPrice.toFixed(2).replace(".", ",")} €
            </div>
          </div>
        ) : (
          "Cargando productos..."
        );
      case 1:
        return (
          <div className="flex flex-col gap-4">
            <div className="text-right font-semibold">
              Precio Total: {totalPrice.toFixed(2).replace(".", ",")} €
            </div>
            <div className="flex items-center">
              <label className="mr-4">Precio Deseado:</label>
              <input
                type="number"
                min="0"
                value={desiredPrice}
                onChange={(e) => setDesiredPrice(Number(e.target.value))}
                className="w-32 p-2 border rounded"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Resumen de la Oferta</h3>
            <div className="text-right font-semibold">
              Precio Total: {totalPrice.toFixed(2).replace(".", ",")} €
            </div>
            <div className="text-right font-semibold">
              Precio Deseado:{" "}
              {Number(desiredPrice).toFixed(2).replace(".", ",")} €
            </div>
            <div className="flex flex-col gap-2">
              {products.map(
                (product) =>
                  quantities[product.id] > 0 && (
                    <div key={product.id} className="flex justify-between">
                      <span>{product.name}</span>
                      <span>
                        {quantities[product.id]} x{" "}
                        {product.price?.toFixed(2).replace(".", ",")} €
                      </span>
                    </div>
                  ),
              )}
            </div>
          </div>
        );
      default:
        return "Paso desconocido";
    }
  }

  const isStepOptional = (step) => {
    return false;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    if (activeStep === steps.length - 1) {
      onOfferFinalize({
        message: "Oferta",
        offerDetails: {
          totalPrice,
          desiredPrice,
          products: products
            .filter((product) => quantities[product.id] > 0)
            .map((product) => ({
              ...product,
              quantity: quantities[product.id],
            })),
        },
      });
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className="w-full">
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length ? (
        <div className="mt-4 mb-2">
          <p>Todos los pasos completados - proceso finalizado</p>
          <div className="flex flex-row pt-2">
            <div className="flex-1" />
            <Button onClick={handleReset}>Reiniciar</Button>
          </div>
        </div>
      ) : (
        <div className="mt-4 mb-2">
          <p>{getStepContent(activeStep)}</p>
          <div className="flex flex-row pt-2">
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              className="mr-2"
            >
              Atrás
            </Button>
            <div className="flex-1" />
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
