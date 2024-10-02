export const Avatar = ({ userName, imagePath }) => {
  return (
    <div class="flex items-center gap-4">
      <img
        className="w-10 h-10 rounded-full opacity-75 transition-opacity group-hover:opacity-100 border border-gray-400"
        src={imagePath}
        alt="Avatar"
      />
      <div class="font-semibold text-gray-200">
        <div>{userName}</div>
      </div>
    </div>
  );
};
