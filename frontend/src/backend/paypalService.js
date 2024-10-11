import { appFetch, fetchConfig } from "./appFetch";
import { config } from "../config/constants.js";

export const addProduct = (
  product,
  onSuccess,
  onErrors,
  reauthenticationCallback,
) => {
  appFetch(`/product/add`, fetchConfig("POST", product), onSuccess, onErrors);
};

export const getPaymentLink = async (paypalDto, onSuccess, onError) => {
  const method = "POST";
  const path = "/payment/create";
  const body = paypalDto;

  const options = fetchConfig(method, body);

  fetch(`${config.BASE_PATH}${path}`, options)
    .then((response) => {
      if (response.ok) {
        if (response.headers.get("content-type").includes("text/plain")) {
          // Si es texto plano, convertirlo a texto
          return response.text();
        } else if (
          response.headers.get("content-type").includes("application/json")
        ) {
          // Si es JSON, convertirlo a objeto JSON
          return response.json();
        } else {
          // Otros tipos de contenido, manejar como sea necesario (Blob, etc.)
          throw new Error("Unexpected response format");
        }
      } else {
        throw new Error("Network response was not ok.");
      }
    })
    .then((data) => {
      // URL de aprobación como texto o el JSON, si fuese necesario
      console.log("URL de aprobación recibida:", data);
      onSuccess(data); // Llamamos al callback de éxito con la URL
    })
    .catch((error) => {
      console.error("Error al crear el pago:", error);
      onError(error); // Llamamos al callback de error si algo falla
    });
};

// Función para crear un pago y redirigir a la URL de aprobación de PayPal
export const createPay = async (data) => {
  try {
    // Llamar a la API para crear el pago
    await new Promise((resolve, reject) => {
      appFetch(
        `/payment/create`,
        fetchConfig("POST", data),
        (approvalUrl) => {
          console.log("approvalUrl", approvalUrl.body);
          // Si la respuesta es exitosa, redirigir a la URL de aprobación
          if (typeof approvalUrl === "string") {
            window.location.href = approvalUrl;
            resolve();
          } else {
            reject(new Error("La respuesta no es una URL válida."));
          }
        },
        (error) => {
          // Manejo de errores
          console.error("Error en la creación del pago:", error);
          reject(error);
        },
      );
    });
  } catch (error) {
    console.error("Error en createPay:", error);
    // Manejo de errores aquí, como mostrar un mensaje al usuario
  }
};
