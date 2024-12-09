import { create } from "zustand";

export type OrderChatVisibility = "opened" | "opening" | "closing" | "closed";
export type OrderChatMode = "bottom_stacked" | "top_columns";

type OrderChatStore = {
  chatVisibility: {
    [key: number]: OrderChatVisibility;
  };
  mode: OrderChatMode | null;
  setupChats: (orderIds: number[], mode: OrderChatMode) => void;
  setChatVisibility: (orderId: number, visible: OrderChatVisibility) => void;
};

const useOrderChatStore = create<OrderChatStore>((set) => ({
  chatVisibility: {},
  mode: null,
  setupChats: (orderIds, mode) => {
    const chats = orderIds.reduce((acc, val) => {
      return { ...acc, [val]: "closed" };
    }, {});

    set(() => ({
      chatVisibility: chats,
      mode,
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
