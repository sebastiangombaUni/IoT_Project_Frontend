import { useState } from "react";
import axios from "axios";
import { Order } from "../types/Order";
import { Dish } from "../types/Dish";

interface OrderCardProps {
  order: Order;
  onStatusChange: (id: string, newStatus: Order['status']) => void;
}

function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoadingDishes, setIsLoadingDishes] = useState(false);

  const handleNextStatus = () => {
    let newStatus: Order['status'];
    if (order.status === 'pending') newStatus = 'in_progress';
    else if (order.status === 'in_progress') newStatus = 'completed';
    else return;
    onStatusChange(order.id, newStatus);
  };

  const getStatusColor = () => {
    if (order.status === "pending") return "bg-orange-500";
    if (order.status === "in_progress") return "bg-yellow-400";
    if (order.status === "completed") return "bg-green-500";
    return "bg-gray-400";
  };

  const formatStatus = () => {
    if (order.status === "pending") return "Pending";
    if (order.status === "in_progress") return "In Progress";
    if (order.status === "completed") return "Completed";
    return "Created";
  };
  
  const openModal = async () => {
    setIsModalOpen(true);
    setIsLoadingDishes(true);
    try {
      const res = await axios.get<Dish[]>("/dishes"); 
      setDishes(res.data); 
    } catch (err) {
      console.error("Error al cargar los platos:", err);
    } finally {
      setIsLoadingDishes(false);
    }
  };
  

  const addDishToOrder = async (dishId: number) => {
    try {
      await axios.post("/invoices", {
        IDOrder: parseInt(order.id),
        IDDish: dishId
      });
      alert("Plato añadido a la orden.");
    } catch (err) {
      console.error("Error al añadir el plato:", err);
    }
  };

  return (
    <div className="bg-[#f9f9f9] text-gray-900 p-6 rounded-lg shadow-md mb-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Order ID: {order.id}</h3>
        <div className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-full ${getStatusColor()}`}></span>
          <span className="font-medium">{formatStatus()}</span>
        </div>
      </div>

      <p className="mb-2"><span className="font-semibold">Table:</span> {order.table}</p>
      <p className="mb-4"><span className="font-semibold">Created at:</span> {new Date(order.createdAt).toLocaleString()}</p>

      <h4 className="font-semibold mb-2">Items:</h4>
      <ul className="mb-4">
        {order.items.map(item => (
          <li key={item.productId}>
            {item.productName} - Qty: {item.quantity}
          </li>
        ))}
      </ul>

      <div className="flex gap-3">
        {order.status !== 'completed' && (
          <button
            onClick={handleNextStatus}
            className="bg-[#ffbc0d] text-black font-semibold px-4 py-2 rounded hover:bg-yellow-400 transition"
          >
            Next Status
          </button>
        )}

        <button
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Editar orden
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="fixed z-50 bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-2/3 lg:w-1/2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h2 className="text-xl font-bold mb-4">Agregar platos a la orden</h2>
            {isLoadingDishes ? (
              <p>Cargando platos...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto">
                {dishes.map((dish) => (
                  <div key={dish.id} className="border p-3 rounded shadow-sm">
                    <h3 className="font-semibold">{dish.name}</h3>
                    <p className="text-sm text-gray-600">${dish.price}</p>
                    <button
                      onClick={() => addDishToOrder(dish.id)}
                      className="mt-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      Agregar
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default OrderCard;
