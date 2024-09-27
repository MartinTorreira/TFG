const ButtonSubmit = ({ label, fn, dark }) => {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        className={`font-semibold py-2 px-4 border-2 rounded ${
          dark
            ? "bg-gray-900 text-white border-gray-900 hover:opacity-90 hover:border-gray-900"
            : "bg-transparent text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white hover:border-transparent"
        }`}
        onClick={fn}
      >
        {label}
      </button>
    </div>
  );
};

export default ButtonSubmit;
