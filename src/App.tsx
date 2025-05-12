import { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import axios from 'axios';
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
  description: string;
  image: string;
  price: number;
  idcategory: string;
}

interface DishFromBackend {
  IDDish: number;
  Name: string;
  Description: string;
  Image: string;
  Price: number;
  IDCategory: string;
}

interface RawInvoice {
  id_order: number;
  id_dish: number;
  created_at: string;
  id_desk: number;
  id_status: string;
}

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);

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

  // Primero cargamos los platos
  useEffect(() => {
    fetchDishes();
  }, []);

  // Luego cargamos las órdenes cuando ya estén los platos
  useEffect(() => {
    if (dishes.length > 0) {
      fetchOrders();
    }
  }, [dishes]);

  const fetchDishes = async () => {
    try {
      const res = await axios.get<DishFromBackend[]>("http://localhost:8080/dishes");
      setDishes(
        res.data.map(d => ({
          id: d.IDDish,
          name: d.Name,
          description: d.Description,
          image: d.Image,
          price: d.Price,
          idcategory: d.IDCategory,
        }))
      );
    } catch (err) {
      console.error("Error al cargar los platos:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get<RawInvoice[]>("http://localhost:8080/invoices");
      const grouped: { [key: string]: Order } = {};

      res.data.forEach((item) => {
        const id = String(item.id_order);

        if (!grouped[id]) {
          grouped[id] = {
            id,
            table: String(item.id_desk),
            status: (
              item.id_status === "InProgess" ? "in_progress" :
              item.id_status === "Done" ? "completed" :
              item.id_status === "created" ? "pending" :
              item.id_status
            ) as "pending" | "in_progress" | "completed",
            createdAt: item.created_at,
            items: [],
          };
        }

        const matchingDish = dishes.find(d => d.id === item.id_dish);

        grouped[id].items.push({
          productId: String(item.id_dish),
          productName: matchingDish?.name || `Plato #${item.id_dish}`,
          quantity: 1,
        });
      });

      setOrders(Object.values(grouped));
    } catch (err) {
      console.error("Error al cargar órdenes:", err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: Order['status']) => {
    try {
      await axios.put(`http://localhost:8080/changestatus/${id}/${newStatus}`);
      setOrders(prev =>
        prev.map(order =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Error al cambiar el estado:", err);
    }
  };

  const handleOrderCreated = (newOrder: Order) => {
    setOrders(prev => [...prev, newOrder]);
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
          <button
            onClick={() => setIsAddDishModalOpen(true)}
            className="absolute right-0"
          >
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
          dishes={dishes}
        />

        <AddDishModal
          isOpen={isAddDishModalOpen}
          onClose={() => setIsAddDishModalOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;
