import { create } from "zustand";

export type ModalName = "shoppingCart" | "notifications" | "userAccount";

export type ModalState = {
  modalVisibility: {
    [key in ModalName]: boolean;
  };
  toggleModal: (modalName: string, isVisible: boolean) => void;
};

const useModalStore = create<ModalState>((set) => ({
  modalVisibility: {
    shoppingCart: false,
    notifications: false,
    userAccount: false,
  },
  toggleModal: (modalName, isVisible) => {
    set((state) => ({
      modalVisibility: {
        ...state.modalVisibility,
        [modalName]: isVisible,
      },
    }));
  },
}));

export default useModalStore;
