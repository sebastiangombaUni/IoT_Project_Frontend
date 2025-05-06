export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
  }
  
  export interface Order {
    id: string;
    table: string;
    status: 'pending' | 'in_progress' | 'completed';
    items: OrderItem[];
    createdAt: string;
  }
  