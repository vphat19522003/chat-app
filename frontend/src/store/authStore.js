import { create } from "zustand";
import axiosCustom from "../config/axios";
import toast from "react-hot-toast";

const useAuthStore = create((set) => ({
  authUser: null,
  isLogining: false,
  isSigningUp: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosCustom.get("/auth/check");

      set({ authUser: res.data });
    } catch (error) {
      console.log(error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  login: async (data) => {
    try {
      set({ isLogining: true });

      const res = await axiosCustom.post("/auth/login", data);

      set({ authUser: res.data });
      toast.success("Login successful");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      set({ isLogining: false });
    }
  },

  signUp: async (data) => {
    try {
      set({ isSigningUp: true });

      const res = await axiosCustom.post("/auth/signup", data);

      set({ authUser: res.data });
      toast.success("Create user successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to sign up user");
      set({ authUser: null });
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosCustom.post("/auth/logout");

      set({ authUser: null });
      toast.success("User logged out");
    } catch (error) {
      console.log(error);
      toast.error("Failed to logout");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosCustom.put("/auth/updateProfile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));

export default useAuthStore;
