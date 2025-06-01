import { create } from "zustand";
type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

//type sama dengan CartItem cuma hanya tidak ada qty
type AddToCartItem = Omit<CartItem, "quantity">;

interface CartState {
  items: CartItem[];
  addToCart: (newItem: AddToCartItem) => void;
}

export const useCartStore = create<CartState>()((set) => ({
  items: [],
  addToCart: (newItem) => {
    // alert(newItem.name);
    set((currentState) => {
      const duplicateItems = [...currentState.items];
      duplicateItems.push({
        productId: newItem.productId,
        name: newItem.name,
        imageUrl: newItem.imageUrl,
        price: newItem.price,
        quantity: 1,
      });
      return {
        ...currentState,
        items: duplicateItems,
      };
    });
  },
}));
