import { create } from "zustand";

export const useStore = create((set) => ({
  activeModule: "Dashboard",
  changeModule: (value) => set({ activeModule: value }),
  role: "employee",
  changeRole: (value) => set({ role: value }),
  user: "",
  changeUser: (value) => set({ user: value }),
}));

export const generatePassword = (length = 8) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
};
