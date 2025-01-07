import { create } from "zustand";
import axiosCustom from "../config/axios";
import toast from "react-hot-toast";

const useChatStore = create((set) => ({
  userList: [],
  messages: [],
  isUserFetching: false,
  isMessageFetching: false,
  selectedUser: null,

  getUser: async () => {
    set({ isUserFetching: true });
    try {
      const res = await axiosCustom.get("/message/users");

      set({ userList: res.data });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUserFetching: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessageFetching: true });
    try {
      const res = await axiosCustom.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      set({ isMessageFetching: false });
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));

export default useChatStore;
