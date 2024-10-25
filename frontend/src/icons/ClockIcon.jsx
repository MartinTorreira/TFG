export const ClockIcon = ({size, color}) => {
  return (
    <svg
      className={`w-${size} h-${size} ${color}`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
};
