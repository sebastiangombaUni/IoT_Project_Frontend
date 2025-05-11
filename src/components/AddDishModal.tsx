import { useState } from "react";

interface AddDishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDish: (dish: {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    idcategory: number;
  }) => void;
}

const AddDishModal: React.FC<AddDishModalProps> = ({ isOpen, onClose, onAddDish }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [idcategory, setIdcategory] = useState<number>(1);

  const handleSubmit = () => {
    if (!name || price === null) {
      alert("Por favor, completa al menos el nombre y el precio.");
      return;
    }

    const newDish = {
      id: Date.now(), // valor temporal hasta que tengas backend
      name,
      price,
      description,
      image,
      idcategory,
    };

    onAddDish(newDish);
    onClose();

    // Limpiar campos
    setName("");
    setPrice(null);
    setDescription("");
    setImage("");
    setIdcategory(1);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed z-50 bg-white text-gray-900 rounded-lg shadow-lg p-6 w-11/12 md:w-1/2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <h2 className="text-xl font-bold mb-4">Agregar nuevo plato</h2>

        {/* Nombre */}
        <label className="block mb-3">
          <span className="text-sm font-medium">Nombre</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </label>

        {/* Precio */}
        <label className="block mb-3">
          <span className="text-sm font-medium">Precio</span>
          <input
            type="number"
            value={price ?? ''}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </label>

        {/* Descripción */}
        <label className="block mb-3">
          <span className="text-sm font-medium">Descripción</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
          />
        </label>

        {/* Imagen */}
        <label className="block mb-3">
          <span className="text-sm font-medium">URL de imagen</span>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </label>

        {/* Categoría */}
        <label className="block mb-6">
          <span className="text-sm font-medium">Categoría (ID)</span>
          <input
            type="number"
            value={idcategory}
            onChange={(e) => setIdcategory(Number(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </label>

        {/* Botones */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Agregar
          </button>
        </div>
      </div>
    </>
  );
};

export default AddDishModal;
