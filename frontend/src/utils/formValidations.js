export const validateRegisterForm = ({
  userName,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
}) => {
  let formErrors = {};

  if (!userName.trim())
    formErrors.userName = "El nombre de usuario es obligatorio";
  if (!firstName.trim()) formErrors.firstName = "El nombre es obligatorio";
  if (!lastName.trim()) formErrors.lastName = "Los apellidos son obligatorios";
  if (!email.trim()) {
    formErrors.email = "El email es obligatorio";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    formErrors.email = "El email no es válido";
  }

  // TODO - DESCOMENTAR ESTA LINEA PARA QUE LA VALIDACION DE CONTRASEÑA SEA CORRECTA
  // if (password.length < 6) {
  //   formErrors.password = "La contraseña debe tener al menos 6 caracteres";
  // }

  // Contraseña obligatoria
  if (!password.trim()) {
    formErrors.password = "La contraseña es obligatoria";
  }

  if (password !== confirmPassword) {
    formErrors.confirmPassword = "Las contraseñas no coinciden";
  }

  return formErrors;
};

export const validateAddProduct = ({
  name,
  quantity,
  price,
  category,
  images,
}) => {
  let formErrors = {};

  if (!name) {
    formErrors.name = "El nombre del producto es obligatorio";
  }

  if (price <= 0) {
    formErrors.price = "El precio debe ser mayor que 0";
  }

  if (quantity <= 0) {
    formErrors.quantity = "La cantidad debe ser mayor que 0";
  }

  if (category) {
    formErrors.category = "Debes escoger una categoría";
  }

  if (images.length < 1) {
    formErrors.images = "Debes añadir imágenes";
  }

  return formErrors;
};

export const validateUpdateProduct = ({ price, images }) => {
  let formErrors = {};

  if (!images) {
    formErrors.images = "Debes añadir imágenes";
  }

  if (price <= 0) {
    formErrors.price = "El precio debe ser mayor que 0";
  }

  return formErrors;
};
