import { create } from "zustand";

export const useStore = create((set) => ({
  activeModule: "Dashboard",
  changeModule: (value) => set({ activeModule: value }),
  role: "employee",
  changeRole: (value) => set({ role: value }),
  user: "",
  changeUser: (value) => set({ user: value }),
}));
