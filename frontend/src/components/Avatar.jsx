export const Avatar = ({ userName, imagePath, size }) => {
  return (
    <div class="flex items-center gap-4">
      <img
        className={`w-${size} h-${size} rounded-full opacity-75 transition-opacity group-hover:opacity-100 border border-gray-400`}
        src={imagePath}
        alt="Avatar"
      />
      <div class="font-semibold text-gray-200">
        <div>{userName}</div>
      </div>
    </div>
  );
};
