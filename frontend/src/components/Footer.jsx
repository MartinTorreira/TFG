export const Footer = () => {
  return (
    <footer class=" bg-gray-100 rounded backdrop-blur-3xl shadow-sm">
      <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span class="text-sm text-gray-700 sm:text-center dark:text-gray-400">
          <span className="font-medium">TFG{" "}</span>
          <span className="">· Compra venta de artículos de segunda mano</span>
        </span>
        <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <a href="#" class="hover:underline me-4 md:me-6">
              Martín Torreira Portos
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};
