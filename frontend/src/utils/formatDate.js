export const formatDate = (dateString, separator) => {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, "0")}${separator}${(date.getMonth() + 1).toString().padStart(2, "0")}${separator}${date.getFullYear()}`;
};
