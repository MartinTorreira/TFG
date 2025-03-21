export const Check = ({ size = 20, color }) => {
  return (
    <svg
      class={`w-${size} h-${size} ${color} dark:text-white`}
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
        stroke-width="2"
        d="M5 11.917 9.724 16.5 19 7.5"
      />
    </svg>
  );
};
