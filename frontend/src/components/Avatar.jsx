export const Avatar = ({ userName, imagePath, size, textColor = "text-gray-200"}) => {
  return (
    <div class="flex items-center gap-4">
      <img
        className={`w-${size} h-${size} rounded-full opacity-75 transition-opacity group-hover:opacity-100 border border-gray-400`}
        src={imagePath}
        alt="Avatar"
      />
      <div class={`font-semibold ${textColor}`}>
        <div>{userName}</div>
      </div>
    </div>
  );
};
