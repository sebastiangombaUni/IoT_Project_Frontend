import { Order } from "../types/Order";

interface OrderCardProps {
  order: Order;
  onStatusChange: (id: string, newStatus: Order['status']) => void;
}

function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const handleNextStatus = () => {
    let newStatus: Order['status'];

    if (order.status === 'pending') newStatus = 'in_progress';
    else if (order.status === 'in_progress') newStatus = 'completed';
    else return; // si ya está 'completed', no hace nada

    onStatusChange(order.id, newStatus); // <- aquí notificamos al padre
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
    return "Unknown";
  };

  return (
    <div className="bg-[#f9f9f9] text-gray-900 p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Order ID: {order.id}</h3>
        <div className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-full ${getStatusColor()}`}></span>
          <span className="font-medium">{formatStatus()}</span>
        </div>
      </div>

      <p className="mb-2">
        <span className="font-semibold">Table:</span> {order.table}
      </p>
      <p className="mb-4">
        <span className="font-semibold">Created at:</span> {new Date(order.createdAt).toLocaleString()}
      </p>

      <h4 className="font-semibold mb-2">Items:</h4>
      <ul className="mb-4">
        {order.items.map(item => (
          <li key={item.productId}>
            {item.productName} - Qty: {item.quantity}
          </li>
        ))}
      </ul>

      {order.status !== 'completed' && (
        <button
          onClick={handleNextStatus}
          className="bg-[#ffbc0d] text-black font-semibold px-4 py-2 rounded hover:bg-yellow-400 transition"
        >
          Next Status
        </button>
      )}
    </div>
  );
}

export default OrderCard;
