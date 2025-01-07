import { create } from "zustand";

const useThemeStore = create((set) => ({
  theme: localStorage.getItem("theme-chat") || "retro",
  setTheme: (theme) => {
    localStorage.setItem("theme-chat", theme);
    set({ theme });
  },
}));

export default useThemeStore;
