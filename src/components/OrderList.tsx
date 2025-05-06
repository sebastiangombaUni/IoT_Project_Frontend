import { Order } from '../types/Order';
import OrderCard from './OrderCard';

interface OrderListProps {
  orders: Order[];
  onStatusChange: (id: string, newStatus: Order['status']) => void;
}

function OrderList({ orders, onStatusChange }: OrderListProps) {
  return (
    <div>
      {orders.map(order => (
        <OrderCard key={order.id} order={order} onStatusChange={onStatusChange} />
      ))}
    </div>
  );
}

export default OrderList;
