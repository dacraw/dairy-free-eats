import { create } from "zustand";

export type OrderChatVisibility = "opened" | "opening" | "closing" | "closed";

type OrderChatStore = {
  chatVisibility: {
    [key: number]: OrderChatVisibility;
  };
  setupChats: (orderIds: number[]) => void;
  setChatVisibility: (orderId: number, visible: OrderChatVisibility) => void;
};

const useOrderChatStore = create<OrderChatStore>((set) => ({
  chatVisibility: {},
  setupChats: (orderIds) => {
    const chats = orderIds.reduce((acc, val) => {
      return { ...acc, [val]: "closed" };
    }, {});

    set(() => ({
      chatVisibility: chats,
    }));
  },
  setChatVisibility: (orderId, visibility) => {
    set((state) => ({
      chatVisibility: {
        ...state.chatVisibility,
        [orderId]: visibility,
      },
    }));
  },
}));

export default useOrderChatStore;
