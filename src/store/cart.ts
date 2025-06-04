import { create } from "zustand";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

type AddToCartItem = Omit<CartItem, "quantity">;

interface CartState {
  items: CartItem[];
  addToCart: (newItem: AddToCartItem) => void;
}

export const useCartStore = create<CartState>()((set) => ({
  items: [],
  addToCart: (newItem) => {
    // 1. kalo item belom ada di cart, push item ke cart dengan quantity 1
    // 2. kalo item udah ada di cart, modify quantity dengan tambah 1
    set((currentState) => {
      // State = immutable -> gaboleh value-nya diubah secara langsung
      const duplicateItems = [...currentState.items]; // duplikat isi items ke array baru

      const existingItemIndex = duplicateItems.findIndex(
        (item) => item.productId === newItem.productId,
      );

      // Kalau item belom ada di cart
      if (existingItemIndex === -1) {
        duplicateItems.push({
          productId: newItem.productId,
          name: newItem.name,
          imageUrl: newItem.imageUrl,
          price: newItem.price,
          quantity: 1,
        });
      } else {
        const itemToUpdate = duplicateItems[existingItemIndex];

        if (!itemToUpdate)
          return {
            ...currentState,
          };

        itemToUpdate.quantity += 1;
      }

      return {
        ...currentState,
        items: duplicateItems,
      };
    });
  },
}));
