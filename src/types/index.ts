export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_veg: boolean;
  is_available: boolean;
  rating: number;
  prep_time_min: number;
  tags: string[];
  sort_order: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  is_veg: boolean;
  quantity: number;
}

export type OrderType = 'Dine-in' | 'Takeaway' | 'Delivery';

export type OrderStatus = 'Received' | 'Preparing' | 'Ready' | 'Delivered';

export interface OrderInsert {
  customer_name: string;
  customer_phone: string;
  order_type: OrderType;
  table_or_address: string | null;
  notes: string | null;
  total: number;
  items_json: CartItem[];
}

export interface Order extends OrderInsert {
  id: string;
  status: OrderStatus;
  created_at: string;
}
