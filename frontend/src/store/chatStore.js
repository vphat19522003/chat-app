import { create } from "zustand";
import axiosCustom from "../config/axios";
import toast from "react-hot-toast";
import useAuthStore from "./authStore";

const useChatStore = create((set, get) => ({
  userList: [],
  messages: [],
  isUserFetching: false,
  isMessageFetching: false,
  isMessageSending: false,
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

  sendMessages: async ({ text, image }) => {
    try {
      const { selectedUser, messages } = useChatStore.getState();
      set({ isMessageFetching: true });

      const res = await axiosCustom.post(
        `/message/send-message/${selectedUser._id}`,
        {
          text,
          image,
        }
      );

      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessageFetching: false });
    }
  },

  catchMessage: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("send-message", (message) => {
      const isMessageSentFromSelectedUser =
        message.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;
      set({ messages: [...get().messages, message] });
    });
  },
  deleteCatchMessage: () => {
    const socket = useAuthStore.getState().socket;

    socket.off("send-message");
  },
}));

export default useChatStore;
