import { useEffect, useState } from 'react';
import OrderList from './components/OrderList';
import TabsSelector from './components/TabsSelector';
import { Order } from './types/Order';
import McDonalds_logo from './assets/McDonalds_logo.png';

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('All');

  useEffect(() => {
    const fakeOrders: Order[] = [
      {
        id: '1',
        table: '5',
        status: 'pending',
        items: [
          { productId: 'burger1', productName: 'Big Mac', quantity: 2 },
          { productId: 'drink1', productName: 'Coca Cola', quantity: 2 },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        table: '3',
        status: 'in_progress',
        items: [
          { productId: 'burger2', productName: 'Quarter Pounder', quantity: 1 },
        ],
        createdAt: new Date().toISOString(),
      },
    ];

    setOrders(fakeOrders);
  }, []);

  const handleStatusChange = (id: string, newStatus: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const filteredOrders = orders.filter(order => {
    if (selectedTab === 'All') return true;
    if (selectedTab === 'Pending') return order.status === 'pending';
    if (selectedTab === 'In Progress') return order.status === 'in_progress';
    if (selectedTab === 'Completed') return order.status === 'completed';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12">
      <div className="flex justify-center mb-100 ">
        <img src={McDonalds_logo} alt="Logo" className="w-24 h-auto" />
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8 text-center">Orders</h1>

        <TabsSelector selectedTab={selectedTab} onSelectTab={setSelectedTab} />

        <OrderList orders={filteredOrders} onStatusChange={handleStatusChange} />
      </div>
    </div>
  );
}

export default App;
