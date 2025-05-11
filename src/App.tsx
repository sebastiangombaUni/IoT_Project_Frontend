import { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import OrderList from './components/OrderList';
import TabsSelector from './components/TabsSelector';
import CreateOrderModal from './components/CreateOrderModal';
import AddDishModal from './components/AddDishModal'; 
import { Order } from './types/Order';
import McDonalds_Logo from './assets/McDonalds_logo.png';
import Configuration_Icon from './assets/configuration_icon.png';

interface Dish {
  id: number;
  name: string;
  price: number;
}

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false); 
  const [,setDishes] = useState<Dish[]>([]); 

  const tabs = ["All", "Pending", "In Progress", "Completed"];
  const currentIndex = tabs.indexOf(selectedTab);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < tabs.length - 1) {
        setSelectedTab(tabs[currentIndex + 1]);
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        setSelectedTab(tabs[currentIndex - 1]);
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

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

  const handleOrderCreated = (newOrder: Order) => {
    setOrders(prev => [...prev, newOrder]);
  };

  const handleAddDish = (newDish: Dish) => {
    setDishes(prev => [...prev, newDish]);
  };

  const filteredOrders = orders.filter(order => {
    if (selectedTab === 'All') return true;
    if (selectedTab === 'Pending') return order.status === 'pending';
    if (selectedTab === 'In Progress') return order.status === 'in_progress';
    if (selectedTab === 'Completed') return order.status === 'completed';
    return true;
  });

  return (
    <div {...handlers} className="min-h-screen bg-gray-900 text-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-6">

        <div className="flex justify-center mb-6">
          <img src={McDonalds_Logo} alt="McDonalds_Logo" className="w-24 h-auto" />
        </div>

        <div className="relative mb-8 flex justify-center items-center">
          <h1 className="text-4xl font-bold">Orders</h1>

          <button onClick={() => setIsAddDishModalOpen(true)} className="absolute right-0">
            <img
              src={Configuration_Icon}
              alt="Configuración"
              className="w-6 h-6 hover:opacity-80 transition"
            />
          </button>
        </div>

        <TabsSelector selectedTab={selectedTab} onSelectTab={setSelectedTab} />

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-mcdonalds-red text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Create new order
          </button>
        </div>

        <OrderList orders={filteredOrders} onStatusChange={handleStatusChange} />

        <CreateOrderModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onOrderCreated={handleOrderCreated}
        />

        <AddDishModal
          isOpen={isAddDishModalOpen}
          onClose={() => setIsAddDishModalOpen(false)}
          onAddDish={handleAddDish}
        />
      </div>
    </div>
  );
}

export default App;
