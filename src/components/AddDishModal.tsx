import { useState } from "react";
import axios from "axios";

interface AddDishModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddDishModal: React.FC<AddDishModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [idcategory, setIdcategory] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  const handleSubmit = async () => {
    if (!name || price === null) {
      alert("Por favor, completa al menos el nombre y el precio.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:8080/dish", {
        name,
        description,
        price,
        image,
        idcategory,
      });

      alert("Plato creado exitosamente.");
      onClose();

      // Limpiar formulario
      setName("");
      setPrice(null);
      setDescription("");
      setImage("");
      setIdcategory(1);
    } catch (err) {
      console.error("Error al crear el plato:", err);
      alert("Hubo un error al crear el plato.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed z-50 bg-white text-gray-900 rounded-lg shadow-lg p-6 w-11/12 md:w-1/2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <h2 className="text-xl font-bold mb-4">Agregar nuevo plato</h2>

        <label className="block mb-3">
          <span className="text-sm font-medium">Nombre</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </label>

        <label className="block mb-3">
          <span className="text-sm font-medium">Precio</span>
          <input
            type="number"
            value={price ?? ""}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </label>

        <label className="block mb-3">
          <span className="text-sm font-medium">Descripción</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
          />
        </label>

        <label className="block mb-3">
          <span className="text-sm font-medium">Ruta o nombre de la imagen</span>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </label>

        <label className="block mb-6">
          <span className="text-sm font-medium">ID Categoría</span>
          <input
            type="number"
            value={idcategory}
            onChange={(e) => setIdcategory(Number(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </label>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isSubmitting ? "Agregando..." : "Agregar"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AddDishModal;
