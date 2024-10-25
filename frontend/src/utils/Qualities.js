import { ClockIcon } from "../icons/ClockIcon";
import { Check } from "../icons/Check";
import { CloseSimpleIcon } from "../icons/CloseSimpleIcon";

export const qualities = [
  { value: "NEW", label: "Nuevo", color: "mint" },
  { value: "LIKE_NEW", label: "Abierto sin usar", color: "cyan" },
  { value: "GOOD", label: "Buen estado", color: "yellow" },
  { value: "USED", label: "Usado", color: "orange" },
  { value: "WORN", label: "Desgastado", color: "plum" },
  { value: "NEEDS_REPAIR", label: "Para reparar", color: "red" },
];


export const purchaseStatusMap = [
  { value: "PENDING", label: "En progreso", color: "orange", icon: <ClockIcon size={4} color="text-orange-900" />, background: "orange-100" },
  { value: "COMPLETED", label: "Completada", color: "green", icon: <Check size={4} color="text-green-900" />, background: "#f0fff4" },
  { value: "REFUNDED", label: "Reembolsado", color: "red", icon: <CloseSimpleIcon size={4} color="text-red-900" />, background: "#ffe6e6" },
]