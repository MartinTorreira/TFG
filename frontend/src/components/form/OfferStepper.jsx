import React, { useContext, useState, useEffect } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { CheckIcon as Check } from "../../icons/CheckIcon.jsx";
import { getProductsByUserId } from "../../backend/productService";
import { LoginContext } from "../context/LoginContext";
import { ArrowLeftIcon } from "../../icons/ArrowLeftIcon.jsx";
import { ArrowRightIcon } from "../../icons/ArrowRightIcon.jsx";

const steps = ["Escoger productos", "Establecer precio", "Envíar oferta"];

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#46beb1",
      animation: "progress 1s ease-in-out forwards",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#46beb1",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
    ...theme.applyStyles("dark", {
      borderColor: theme.palette.grey[800],
    }),
  },
  "@keyframes progress": {
    "0%": {
      width: "0%",
    },
    "100%": {
      width: "100%",
    },
  },
}));

const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  "& .QontoStepIcon-completedIcon": {
    color: "#46beb1",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
  ...theme.applyStyles("dark", {
    color: theme.palette.grey[700],
  }),
  ...(ownerState.active && {
    color: "#46beb1",
  }),
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check size={"6"} />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

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
          <div className="flex flex-col gap-4 px-16 mt-16">
            {products.length > 0
              ? products.map((product) => (
                  <div
                    key={product.id}
                    className="border p-4 flex items-center rounded-lg shadow-sm mt-1"
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
                          Math.min(
                            Math.max(e.target.value, 0),
                            product.quantity,
                          ),
                        )
                      }
                      className="w-16 p-2 border rounded ml-4"
                    />
                  </div>
                ))
              : null}
            <div className="text-right flex flex-row justify-end space-x-2 font-medium">
              <p>{"Precio inicial "}</p>
              <p>{totalPrice.toFixed(2).replace(".", ",")} €</p>
            </div>
          </div>
        ) : (
          "Cargando productos..."
        );
      case 1:
        return (
          <div className="flex flex-col gap-4 mt-20 px-20">
            <div className="flex flex-row items-start space-x-2 font-medium">
              <p className="font-normal">{"Precio inicial "}</p>
              <p className="font-normal">
                {totalPrice.toFixed(2).replace(".", ",")} €
              </p>
            </div>
            <div className="flex flex-row items-center">
              <label className="mb-2 text-lg font-semibold text-left w-full">
                Precio total de la oferta
              </label>
              <input
                type="number"
                min="0"
                value={desiredPrice}
                onChange={(e) => setDesiredPrice(Number(e.target.value))}
                className="w-32 p-2 border rounded"
              />
              <p className="font-medium ml-2">{"  €"}</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col gap-6 px-36 mt-20">
            <h3 className="text-lg font-semibold text-center">
              Resumen de la oferta
            </h3>
            <div className="flex flex-col gap-2 mt-4">
              {products.map(
                (product) =>
                  quantities[product.id] > 0 && (
                    <div
                      key={product.id}
                      className="flex justify-between items-center bg-gray-100 p-3 rounded-md"
                    >
                      <span className="flex-grow text-left">
                        {product.name}
                      </span>
                      <span>
                        {quantities[product.id]} x{" "}
                        {product.price?.toFixed(2).replace(".", ",")} €
                      </span>
                    </div>
                  ),
              )}
            </div>
            <div className="flex flex-col gap-2 font-semibold mt-6">
              <div className="flex justify-between border-t pt-4">
                <p>Precio inicial</p>
                <p>{totalPrice.toFixed(2).replace(".", ",")} €</p>
              </div>
              <div className="flex justify-between">
                <p>Precio deseado</p>
                <p>{Number(desiredPrice).toFixed(2).replace(".", ",")} €</p>
              </div>
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
    <div className="w-full flex flex-col h-full">
      <div className="flex-grow">
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<QontoConnector />}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
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
          </div>
        )}
      </div>
      <div className="flex flex-row pt-2">
        <button
          disabled={activeStep === 0}
          onClick={handleBack}
          className="flex flex-row items-center justify-center  rounded-full px-2 p-1 text-accent-dark font-medium"
        >
          <ArrowLeftIcon size={16} />
          <p className="ml-2">Anterior</p>
        </button>
        <div className="flex-1" />
        <button
          onClick={handleNext}
          className="flex flex-row items-center justify-center  rounded-full px-2 p-1 text-accent-dark font-medium"
        >
          <p className="">
            {activeStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
          </p>
          <ArrowRightIcon size={16} />
        </button>
      </div>
    </div>
  );
}
