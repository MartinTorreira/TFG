import React, { useContext, useState } from "react";
import Modal from "@mui/material/Modal";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { LoginContext } from "../context/LoginContext";
import { ArrowLeftIcon } from "../../icons/ArrowLeftIcon.jsx";
import { ArrowRightIcon } from "../../icons/ArrowRightIcon.jsx";
import { CheckIcon as Check } from "../../icons/CheckIcon.jsx";
import { RatingComponent } from "../RatingComponent";
import { rateUser } from "../../backend/userService";

const steps = ["Confirmar entrega", "Valorar vendedor"];

// Estilos para el conector personalizado
const CustomConnector = styled(StepConnector)(({ theme }) => ({
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

// Icono personalizado del paso
const StepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  "& .StepIcon-completedIcon": {
    color: "#46beb1",
    zIndex: 1,
    fontSize: 18,
  },
  "& .StepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
  ...(ownerState.active && {
    color: "#46beb1",
  }),
}));

function CustomStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <StepIconRoot ownerState={{ active }} className={className}>
      {completed ? <Check size={"6"} /> : <div className="StepIcon-circle" />}
    </StepIconRoot>
  );
}

export const UserRefundModal = ({ open, handleClose, handleConfirm, sellerId }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState("forward");
  const { user } = useContext(LoginContext);

  const handleRate = (value) => {
    console.log("Nuevo valor"+ value);
    rateUser(sellerId, value, () => {
      console.log("Valoración realizada", value);
    }, (err) => {console.log("Error al realizar la valoración"+err)});
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col space-y-8 mt-6">
            <h1 className="text-3xl">
              ¿Seguro que quieres marcar la compra como finalizada?
            </h1>
            <div
              className="flex items-center w-fit mx-auto p-4 mb-10 text-sm text-gray-800 rounded-lg bg-accent-light/40"
              role="alert"
            >
              <svg
                class="flex-shrink-0 inline w-4 h-4 me-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <div>
                <p>Si marcas la compra como finalizada no podrás solicitar un reembolso</p>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col space-y-8 mt-6">
            <h1 className="text-3xl">
              ¡Valora al vendedor!
            </h1>
            <RatingComponent rate={0} onChange={(value) => {handleRate(value)}} editable />
          </div>
        );
      default:
        return "Paso desconocido";
    }
  }

  const handleNext = () => {
    setDirection("forward");
    if (activeStep === steps.length - 1) {
      handleConfirm();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setDirection("backward");
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="w-1/3 bg-white mx-auto flex flex-col justify-center mt-20 rounded shadow-lg p-6">
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<CustomConnector />}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <div className="mt-4">
          {activeStep === steps.length ? (
            <div className="text-center">
              <p>Proceso completado</p>
              <button
                onClick={handleReset}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Reiniciar
              </button>
            </div>
          ) : (
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: direction === "forward" ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction === "forward" ? -100 : 100 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-4 mt-10 px-10 text-center"
            >
              {getStepContent(activeStep)}
            </motion.div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <button
            disabled={activeStep === 0}
            onClick={handleBack}
            className="flex flex-row items-center justify-center rounded-full px-2 p-1 text-accent-dark font-medium"
          >
            <ArrowLeftIcon size={16} className="mr-2" />
            Anterior
          </button>

          <button
            onClick={handleNext}
            className="flex flex-row items-center justify-center rounded-full px-2 p-1 text-accent-dark font-medium"
          >
            {activeStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
            <ArrowRightIcon size={16} className="ml-2" />
          </button>
        </div>
      </div>
    </Modal>
  );
};
