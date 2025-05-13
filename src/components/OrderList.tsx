import { Order } from '../types/Order';
import OrderCard from './OrderCard';

interface OrderListProps {
  orders: Order[];
  onStatusChange: (id: string, newStatus: Order['status']) => void;
  onDelete: (id: string) => void;
}

function OrderList({ orders, onStatusChange, onDelete }: OrderListProps) {
  return (
    <>
      {orders.map(order => (
        <OrderCard
          key={order.id}
          order={order}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}


export default OrderList;
