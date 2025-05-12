import { useEffect, useState } from "react";
import axios from "axios";
import { Order } from "../types/Order"; // Asegúrate de tener esta definición

interface Dish {
  id: number;
  name: string;
  price: number;
}

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  dishes: Dish[];
  onOrderCreated: (newOrder: Order) => void;
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  onClose,
  dishes,
  onOrderCreated,
}) => {
  const [selectedDishes, setSelectedDishes] = useState<Set<number>>(new Set());
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
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

  const handleCreateOrder = async () => {
    if (!tableNumber || selectedDishes.size === 0) {
      alert("Debes seleccionar una mesa y al menos un plato.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Crear la orden
      const res = await axios.post("http://localhost:8080/order", {
        id_desk: tableNumber,
        id_status: "pending",
      });

      const id_order = res.data;

      // 2. Asociar los platos a la orden
      await Promise.all(
        [...selectedDishes].map(dishId =>
          axios.post("http://localhost:8080/invoice", {
            id_order,
            id_dish: dishId,
          })
        )
      );

      // 3. Construir objeto tipo Order (local)
      const createdAt = new Date().toISOString();
      const newOrder: Order = {
        id: String(id_order),
        table: String(tableNumber),
        status: "pending",
        createdAt,
        items: [...selectedDishes].map(dishId => {
          const dish = dishes.find(d => d.id === dishId);
          return {
            productId: String(dish?.id || dishId),
            productName: dish?.name || "Plato desconocido",
            quantity: 1,
          };
        }),
      };

      alert("Orden creada exitosamente.");
      onOrderCreated(newOrder);
      onClose();

    } catch (err) {
      console.error("Error al crear la orden:", err);
      alert("Hubo un error al crear la orden.");
    } finally {
      setIsSubmitting(false);
    }
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
          {dishes.map(dish => (
            <div
              key={dish.id}
              className={`border p-3 rounded cursor-pointer ${
                selectedDishes.has(dish.id)
                  ? "bg-green-100 border-green-500"
                  : ""
              }`}
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
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isSubmitting ? "Creando..." : "Crear orden"}
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateOrderModal;
