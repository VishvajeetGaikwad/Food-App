import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useCartStore = create()(
  persist(
    (set) => ({
      count: 0,
      increment: () => {
        set((state: any) => ({ count: state.count + 1 }));
      },
    }),
    {
      name: "cart-name",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
