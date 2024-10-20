export const CheckIcon = ({ size }) => {
  return (
    <svg
      class={`w-${size} h-${size} text-gray-800 dark:text-white`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width={`${size}`}
      height={`${size}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1"
        d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
};
