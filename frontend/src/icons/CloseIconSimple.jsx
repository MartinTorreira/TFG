export const CloseIconSimple = ({ size, color }) => {
  return (
    <svg
      className={`w-${size} h-${size} ${color}`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width={`${size}`}
      height={`${size}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 18 17.94 6M18 18 6.06 6"
      />
    </svg>
  );
};
