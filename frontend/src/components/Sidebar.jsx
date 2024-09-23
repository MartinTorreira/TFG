export function Sidebar({ isOpen }) {
    return (
      <div
        className={`fixed top-0 left-0 h-full p-4 transition-transform transform bg-gray-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '300px' }}
      >
        <h2 className="mt-20 text-xl font-semibold" >Todas las categorías</h2>
        
      </div>
    );
  }