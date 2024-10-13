import { MenuItem } from "./restaurantType";
export interface CartItem extends MenuItem {
  _id: string; // Required ID
  // menuId: string; // Include this if you want to track by menuId
  name: string;
  image: string;
  price: number; // Make sure this is a number
  quantity: number; // Make sure this is a number
  description: string; // This is optional
}

export type CartState = {
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  clearCart: () => void;
  removeFromTheCart: (id: string) => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
};
