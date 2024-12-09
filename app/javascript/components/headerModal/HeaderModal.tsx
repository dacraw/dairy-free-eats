import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import useModalStore, { ModalName, ModalState } from "stores/modalStore";

const HeaderModal = ({
  basic = false,
  children,
  headerText,
  triggerElement,
  modalName,
}: {
  basic?: boolean;
  children: React.ReactNode;
  headerText?: string;
  modalName: string;
  triggerElement: React.ReactNode;
}) => {
  const { modalVisibility, toggleModal } = useModalStore();
  const handleToggle = (value: boolean) => toggleModal(modalName, value);
  const visible = modalVisibility[modalName as ModalName];
  const location = useLocation();

  const modalRef = useRef<HTMLDivElement>(null);

  const closeModal = useCallback(
    (e: MouseEvent) => {
      if (modalRef.current) {
        if (!modalRef.current.contains(e.target as Node)) handleToggle(false);
      }
    },
    [visible]
  );

  useEffect(() => {
    document.addEventListener("click", closeModal);

    return () => document.removeEventListener("click", closeModal);
  }, []);

  useEffect(() => {
    handleToggle(false);
  }, [location]);

  useEffect(() => {
    if (visible) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [visible]);

  return (
    <div className="relative" ref={modalRef}>
      <div onClick={() => handleToggle(!visible)} className="cursor-pointer">
        {triggerElement}
      </div>
      {visible && (
        <div
          className={`
            gray-background rounded p-4 fixed left-0 top-0 w-screen h-screen 
            md:absolute md:right-0 z-[340] ${
              basic ? "md:w-auto md:h-auto" : "md:w-96 md:max-h-96"
            } md:top-8 md:left-auto 
          `}
        >
          <div className="flex justify-end md:hidden">
            <div
              className="cursor-pointer inline-flex items-center gap-x-2 border-2 rounded-lg bg-white text-gray-950 font-bold text-sm px-2 overflow-y-auto"
              onClick={() => handleToggle(false)}
            >
              <p>Close</p>
              <FontAwesomeIcon
                className="text-red-700 text-2xl"
                icon={faClose}
              />
            </div>
          </div>
          {headerText && (
            <h3 className="text-center font-bold mb-4 border-b-2 pb-2">
              {headerText}
            </h3>
          )}
          {children}
        </div>
      )}
    </div>
  );
};
export default HeaderModal;
