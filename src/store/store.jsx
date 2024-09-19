import { create } from "zustand";

// Define the store
// const useStore = create((set) => {
//   activeModule: "Dashboard", // Initial state

//   changeModule: (value) => set(({ activeModule: value} )
// }));

export const useStore = create((set) => ({
  activeModule: "Dashboard",
  changeModule: (value) => set({ activeModule: value }),
  discplinaryAction: [
    "Verbal Warning",
    "Written Warning",
    "Performance Improvement Plan",
    "Suspension",
    "Final Warning",
  ],
  removeDiscplinaryAction: (type) =>
    set({
      discplinaryAction: discplinaryAction.filter((t) => t !== type),
    }),
}));
