import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";

dayjs.extend(relativeTime);
dayjs.locale("es");

export const getTimeDifference = (timestamp) => {
  console.log("TEMPOOOOO =>" + timestamp);
  return dayjs(timestamp).fromNow();
};

export const formatDate = (dateString, separator) => {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, "0")}${separator}${(date.getMonth() + 1).toString().padStart(2, "0")}${separator}${date.getFullYear()}`;
};
