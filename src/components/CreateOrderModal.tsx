import { useEffect, useState } from "react";
import { Order } from "../types/Order";

interface Dish {
  id: number;
  name: string;
  price: number;
}

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: (newOrder: Order) => void;
}

const fakeDishes: Dish[] = [
  { id: 1, name: "Big Mac", price: 15000 },
  { id: 2, name: "Papas Grandes", price: 7000 },
  { id: 3, name: "Coca Cola", price: 5000 },
  { id: 4, name: "McNuggets", price: 10000 },
];

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ isOpen, onClose, onOrderCreated }) => {
  const [selectedDishes, setSelectedDishes] = useState<Set<number>>(new Set());
  const [tableNumber, setTableNumber] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // resetear modal al cerrar
      setSelectedDishes(new Set());
      setTableNumber(null);
    }
  }, [isOpen]);

  const toggleDish = (id: number) => {
    setSelectedDishes(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const handleCreateOrder = () => {
    if (!tableNumber || selectedDishes.size === 0) {
      alert("Por favor, ingresa el número de mesa y selecciona al menos un plato.");
      return;
    }

    const selectedDishObjects = fakeDishes.filter(dish => selectedDishes.has(dish.id));

    const newOrder: Order = {
      id: String(Date.now()), // simulación de ID
      table: String(tableNumber),
      status: "pending",
      createdAt: new Date().toISOString(),
      items: selectedDishObjects.map(dish => ({
        productId: String(dish.id),
        productName: dish.name,
        quantity: 1 // por simplicidad
      }))
    };

    onOrderCreated(newOrder);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed z-50 bg-white text-gray-900 rounded-lg shadow-lg p-6 w-11/12 md:w-2/3 lg:w-1/2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <h2 className="text-xl font-bold mb-4">Crear nueva orden</h2>

        <label className="block mb-3">
          <span className="text-sm font-medium">Número de mesa</span>
          <input
            type="number"
            value={tableNumber ?? ''}
            onChange={(e) => setTableNumber(Number(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </label>

        <h3 className="text-lg font-semibold mt-4 mb-2">Seleccionar platos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto">
          {fakeDishes.map(dish => (
            <div
              key={dish.id}
              className={`border p-3 rounded cursor-pointer ${selectedDishes.has(dish.id) ? 'bg-green-100 border-green-500' : ''}`}
              onClick={() => toggleDish(dish.id)}
            >
              <h4 className="font-medium">{dish.name}</h4>
              <p className="text-sm text-gray-600">${dish.price}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreateOrder}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Crear orden
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateOrderModal;
