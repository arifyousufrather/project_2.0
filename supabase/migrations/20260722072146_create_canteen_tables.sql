/*
# Canteen Shop — Categories, Menu Items, Orders

1. New Tables
- `categories` — food categories (Veg, Non-Veg, Chinese, South Indian, Beverages, Desserts, Fast Food)
  - `id` uuid PK, `name` text, `slug` text unique, `description` text, `icon` text (emoji/short label), `sort_order` int
- `menu_items` — individual dishes available to order
  - `id` uuid PK, `category_id` FK -> categories, `name`, `description`, `price` numeric, `image_url` text (Pexels photo), `is_veg` boolean, `is_available` boolean default true, `rating` numeric, `prep_time_min` int, `tags` text[], `sort_order` int
- `orders` — customer orders
  - `id` uuid PK, `customer_name`, `customer_phone`, `order_type` (Dine-in / Takeaway / Delivery), `table_or_address` text, `notes` text, `status` text default 'Received', `total` numeric, `items_json` jsonb (snapshot of ordered items), `created_at` timestamptz
2. Security
- Enable RLS on all three tables.
- Public read + insert (no-auth single-tenant canteen app): policies use `TO anon, authenticated`.
- Orders: anyone can create an order (customers), and can read order status by id. UPDATE/DELETE disabled (no dashboard needed).
3. Seed data
- 8 categories + ~36 menu items with real Pexels food photo URLs.
4. Notes
- `items_json` stores a snapshot of the cart at order time so historical orders remain accurate even if menu prices change later.
- All prices in INR (₹) to match a canteen shop context.
*/

-- ---------- categories ----------
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text,
  sort_order int NOT NULL DEFAULT 0
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_read_categories" ON categories;
CREATE POLICY "anon_read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

-- ---------- menu_items ----------
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  image_url text,
  is_veg boolean NOT NULL DEFAULT true,
  is_available boolean NOT NULL DEFAULT true,
  rating numeric(2,1) NOT NULL DEFAULT 4.5,
  prep_time_min int NOT NULL DEFAULT 15,
  tags text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_read_menu_items" ON menu_items;
CREATE POLICY "anon_read_menu_items" ON menu_items FOR SELECT
  TO anon, authenticated USING (true);

-- ---------- orders ----------
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  order_type text NOT NULL DEFAULT 'Takeaway',
  table_or_address text,
  notes text,
  status text NOT NULL DEFAULT 'Received',
  total numeric(10,2) NOT NULL DEFAULT 0,
  items_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_read_orders" ON orders;
CREATE POLICY "anon_read_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- ---------- indexes ----------
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- ---------- seed: categories ----------
INSERT INTO categories (name, slug, description, icon, sort_order) VALUES
('Vegetarian', 'veg', 'Wholesome veg classics — rich curries, dal, paneer & more', 'Veg', 1),
('Non-Veg', 'non-veg', 'Chicken, mutton & egg specialties cooked to perfection', 'Non-Veg', 2),
('Chinese', 'chinese', 'Indo-Chinese favorites — noodles, manchurian & fried rice', 'Chinese', 3),
('South Indian', 'south-indian', 'Crisp dosas, fluffy idlis & filter coffee', 'South Indian', 4),
('Fast Food', 'fast-food', 'Burgers, pizzas, sandwiches & fries', 'Fast Food', 5),
('Beverages', 'beverages', 'Hot & cold drinks, shakes & smoothies', 'Beverages', 6),
('Desserts', 'desserts', 'Sweet endings — Indian mithai & ice cream', 'Desserts', 7),
('Combos', 'combos', 'Value meal combos for a full plate of happiness', 'Combos', 8)
ON CONFLICT (slug) DO NOTHING;

-- ---------- seed: menu items ----------
-- Helper: image URL pattern https://images.pexels.com/photos/{ID}/pexels-photo-{ID}.jpeg?auto=compress&cs=tinysrgb&w=800
INSERT INTO menu_items (category_id, name, description, price, image_url, is_veg, rating, prep_time_min, tags, sort_order)
SELECT c.id, m.name, m.description, m.price, m.image_url, m.is_veg, m.rating, m.prep_time_min, m.tags, m.sort_order
FROM (VALUES
  -- VEGETARIAN (slug: veg)
  ('veg', 'Paneer Butter Masala', 'Cottage cheese cubes simmered in a rich, creamy tomato-butter gravy', 180, 'https://images.pexels.com/photos/2871757/pexels-photo-2871757.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4.7, 20, ARRAY['Bestseller','Creamy'], 1),
  ('veg', 'Dal Makhani', 'Black lentils slow-cooked overnight with butter and cream', 140, 'https://images.pexels.com/photos/14583196/pexels-photo-14583196.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4.6, 25, ARRAY['Classic','Slow-cooked'], 2),
  ('veg', 'Veg Biryani', 'Fragrant basmati rice layered with spiced vegetables and saffron', 160, 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4.5, 30, ARRAY['Aromatic','Filling'], 3),
  ('veg', 'Chole Bhature', 'Spiced chickpea curry served with fluffy fried bhature', 120, 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4.6, 20, ARRAY['Popular','North-Indian'], 4),
  ('veg', 'Palak Paneer', 'Soft paneer in a smooth spinach gravy with garlic tempering', 170, 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4.5, 20, ARRAY['Healthy','Iron-rich'], 5),

  -- NON-VEG (slug: non-veg)
  ('non-veg', 'Chicken Biryani', 'Hyderabadi-style dum biryani with marinated chicken and saffron rice', 220, 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=800', false, 4.8, 35, ARRAY['Bestseller','Dum-cooked'], 1),
  ('non-veg', 'Butter Chicken', 'Tandoori chicken in a velvety tomato-butter sauce with cashews', 240, 'https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg?auto=compress&cs=tinysrgb&w=800', false, 4.8, 25, ARRAY['Bestseller','Creamy'], 2),
  ('non-veg', 'Chicken Curry', 'Home-style chicken curry with onions, tomatoes and aromatic spices', 200, 'https://images.pexels.com/photos/2412948/pexels-photo-2412948.jpeg?auto=compress&cs=tinysrgb&w=800', false, 4.6, 30, ARRAY['Classic','Spicy'], 3),
  ('non-veg', 'Mutton Rogan Josh', 'Tender mutton slow-cooked in Kashmiri spices and yogurt', 280, 'https://images.pexels.com/photos/45187/pexels-photo-45187.jpeg?auto=compress&cs=tinysrgb&w=800', false, 4.7, 40, ARRAY['Premium','Slow-cooked'], 4),
  ('non-veg', 'Egg Curry', 'Boiled eggs in a spicy onion-tomato masala', 130, 'https://images.pexels.com/photos/5409026/pexels-photo-5409026.jpeg?auto=compress&cs=tinysrgb&w=800', false, 4.4, 20, ARRAY['Comfort','Budget'], 5),

  -- CHINESE (slug: chinese)
  ('chinese', 'Veg Hakka Noodles', 'Stir-fried noodles tossed with crunchy veggies and soy sauce', 130, 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4.5, 15, ARRAY['Wok-tossed','Quick'], 1),
  ('chinese', 'Veg Manchurian', 'Fried veg balls in a tangy, spicy Indo-Chinese gravy', 140, 'https://images.pexels.com/photos/28445826/pexels-photo-28445826.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4.6, 20, ARRAY['Tangy','Spicy'], 2),
  ('chinese', 'Chicken Fried Rice', 'Wok-tossed rice with chicken, eggs and spring onions', 160, 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=800', false, 4.6, 15, ARRAY['Filling','Wok-tossed'], 3),
  ('chinese', 'Chilli Chicken', 'Crispy chicken in a hot, sweet and sour soy-garlic sauce', 180, 'https://images.pexels.com/photos/28445826/pexels-photo-28445826.jpeg?auto=compress&cs=tinysrgb&w=800', false, 4.7, 20, ARRAY['Spicy','Crispy'], 4),
  ('chinese', 'Schezwan Noodles', 'Fiery schezwan sauce noodles with vegetables', 140, 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4.5, 15, ARRAY['Fiery','Veg'], 5),

  -- SOUTH INDIAN (slug: south-indian)
  ('south-indian', 'Masala Dosa', 'Crispy rice crepe stuffed with spiced potato masala, sambar & chutney', 90, 'https://images.pexels.com/photos/4158292/pexels-photo-4158292.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4.7, 15, ARRAY['Bestseller','Crispy'], 1),
  ('south-indian', 'Idli Sambar', 'Steamed rice cakes served with lentil sambar and coconut chutney', 70, 'https://images.pexels.com/photos/4158292/pexels-photo-4158292.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4.5, 10, ARRAY['Healthy','Steamed'], 2),
  ('south-indian', 'Medu Vada', 'Crispy lentil donuts with sambar and three chutneys', 80, 'https://images.pexels.com/photos/4158292/pexels-photo-4158292.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4.5, 12, ARRAY['Crispy','Breakfast'], 3),
  ('south-indian', ' Uttapam', 'Thick savory pancake topped with onion, tomato and chillies', 100, 'https://images.pexels.com/photos/4158292/pexels-photo-4158292.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4.4, 15, ARRAY['Hearty','Breakfast'], 4),
  ('south-indian', 'Filter Coffee', 'Authentic South-Indian decoction with frothy milk', 40, 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4.6, 5, ARRAY['Authentic','Hot'], 5),

  -- FAST FOOD (slug: fast-food)
  ('fast-food', 'Margherita Pizza', 'Wood-fired pizza with mozzarella, basil and tangy tomato sauce', 199, 'https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4.6, 20, ARRAY['Cheesy','Classic'], 1),
  ('fast-food', 'Cheese Burger', 'Juicy patty with melted cheese, lettuce and house sauce', 150, 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800', false, 4.7, 15, ARRAY['Bestseller','Juicy'], 2),
  ('fast-food', 'French Fries', 'Golden, crispy fries sprinkled with peri-peri seasoning', 90, 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4.5, 10, ARRAY['Crispy','Snack'], 3),
  ('fast-food', 'Veg Sandwich', 'Grilled sandwich loaded with veggies, cheese and mint chutney', 100, 'https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4.4, 10, ARRAY['Grilled','Veg'], 4),
  ('fast-food', 'Chicken Burger', 'Crispy fried chicken patty with jalapenos and mayo', 170, 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800', false, 4.6, 15, ARRAY['Crispy','Spicy'], 5),

  -- BEVERAGES (slug: beverages)
  ('beverages', 'Cold Coffee', 'Chilled coffee blended with milk, ice cream and chocolate', 80, 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4.7, 8, ARRAY['Chilled','Creamy'], 1),
  ('beverages', 'Masala Chai', 'Spiced Indian tea brewed with ginger, cardamom and cloves', 25, 'https://images.pexels.com/photos/2396220/pexels-photo-2396220.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4.6, 5, ARRAY['Hot','Classic'], 2),
  ('beverages', 'Mango Shake', 'Thick mango milkshake topped with cream', 90, 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4.6, 8, ARRAY['Seasonal','Thick'], 3),
  ('beverages', 'Fresh Lime Soda', 'Refreshing lime soda — sweet, salted or mixed', 40, 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4.5, 5, ARRAY['Refreshing','Cold'], 4),
  ('beverages', 'Hot Chocolate', 'Rich melted chocolate with steamed milk and whipped cream', 100, 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4.6, 8, ARRAY['Rich','Hot'], 5),

  -- DESSERTS (slug: desserts)
  ('desserts', 'Gulab Jamun', 'Warm syrup-soaked milk dumplings — a festive favorite', 60, 'https://images.pexels.com/photos/8683667/pexels-photo-8683667.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4.8, 5, ARRAY['Bestseller','Sweet'], 1),
  ('desserts', 'Rasmalai', 'Soft cheese discs soaked in saffron-cardamom milk', 80, 'https://images.pexels.com/photos/8683667/pexels-photo-8683667.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4.7, 5, ARRAY['Creamy','Chilled'], 2),
  ('desserts', 'Vanilla Ice Cream', 'Creamy vanilla bean ice cream with a chocolate drizzle', 70, 'https://images.pexels.com/photos/2130167/pexels-photo-2130167.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4.5, 3, ARRAY['Cold','Classic'], 3),
  ('desserts', 'Chocolate Brownie', 'Warm fudgy brownie served with a scoop of ice cream', 120, 'https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4.7, 10, ARRAY['Warm','Fudgy'], 4),
  ('desserts', 'Jalebi', 'Crispy, syrupy spirals of golden goodness', 50, 'https://images.pexels.com/photos/8683667/pexels-photo-8683667.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4.5, 10, ARRAY['Crispy','Sweet'], 5),

  -- COMBOS (slug: combos)
  ('combos', 'Veg Thali Combo', 'Dal, two sabzis, rice, roti, salad, papad & sweet', 180, 'https://images.pexels.com/photos/10523897/pexels-photo-10523897.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4.7, 25, ARRAY['Value','Complete-meal'], 1),
  ('combos', 'Non-Veg Thali Combo', 'Chicken curry, biryani, roti, salad, raita & dessert', 250, 'https://images.pexels.com/photos/10523897/pexels-photo-10523897.jpeg?auto=compress&cs=tinysrgb&w=800', false, 4.8, 30, ARRAY['Value','Complete-meal'], 2),
  ('combos', 'Burger Combo', 'Cheese burger + fries + cold drink', 249, 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800', false, 4.6, 15, ARRAY['Value','Quick-meal'], 3),
  ('combos', 'Dosa Combo', 'Masala dosa + filter coffee + idli (1 pc)', 130, 'https://images.pexels.com/photos/4158292/pexels-photo-4158292.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4.7, 15, ARRAY['Value','Breakfast'], 4)
) AS m(slug, name, description, price, image_url, is_veg, rating, prep_time_min, tags, sort_order)
JOIN categories c ON c.slug = m.slug
ON CONFLICT DO NOTHING;
