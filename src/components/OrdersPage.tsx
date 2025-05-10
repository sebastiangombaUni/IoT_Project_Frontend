import { useState } from 'react';
import CreateOrderModal from './CreateOrderModal';

function OrdersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="p-4">
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
      >
        Crear nueva orden
      </button>

      {/* Aquí irían las tarjetas de órdenes existentes */}

      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onOrderCreated={() => {
          // Aquí podrías recargar las órdenes
        }}
      />
    </div>
  );
}
