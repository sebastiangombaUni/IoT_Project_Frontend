import { useState } from "react";
import { Order, OrderItem } from "../types/Order";

interface NewOrderFormProps {
  onAddOrder: (order: Order) => void;
}

function NewOrderForm({ onAddOrder }: NewOrderFormProps) {
  const [table, setTable] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [items, setItems] = useState<OrderItem[]>([]);

  const handleAddItem = () => {
    if (!productName || quantity <= 0) return;

    setItems([...items, { productId: crypto.randomUUID(), productName, quantity }]);
    setProductName("");
    setQuantity(1);
  };

  const handleSubmitOrder = () => {
    if (!table || items.length === 0) return;

    const newOrder: Order = {
      id: crypto.randomUUID(),
      table,
      status: "pending",
      items,
      createdAt: new Date().toISOString(),
    };

    onAddOrder(newOrder);

    // Reset form
    setTable("");
    setItems([]);
  };

  return (
    <div style={{ border: "1px solid gray", padding: "1rem", marginBottom: "2rem" }}>
      <h2>Create New Order</h2>

      <div>
        <label>Table:</label>
        <input
          type="text"
          value={table}
          onChange={(e) => setTable(e.target.value)}
        />
      </div>

      <div>
        <h4>Add Product</h4>
        <input
          type="text"
          placeholder="Product name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
        <button onClick={handleAddItem}>Add Item</button>
      </div>

      <ul>
        {items.map((item) => (
          <li key={item.productId}>
            {item.productName} - Qty: {item.quantity}
          </li>
        ))}
      </ul>

      <button onClick={handleSubmitOrder}>Create Order</button>
    </div>
  );
}

export default NewOrderForm;
