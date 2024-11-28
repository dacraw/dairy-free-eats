import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";

const HeaderModal = ({
  triggerElement,
  children,
}: {
  triggerElement: React.ReactNode;
  children: React.ReactNode;
}) => {
  const [visible, toggleVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeModal = (e: MouseEvent) => {
      if (modalRef.current) {
        if (!modalRef.current.contains(e.target as Node)) toggleVisible(false);
      }
    };

    document.addEventListener("click", closeModal);

    return () => document.removeEventListener("click", closeModal);
  }, []);

  return (
    <div className="z-50 relative" ref={modalRef}>
      <div
        onClick={() => toggleVisible(!visible)}
        className="cursor-pointer z-100"
      >
        {triggerElement}
      </div>
      {visible && (
        <div className="gray-background rounded p-4 fixed left-0 top-0 w-screen h-screen md:absolute md:right-0 md:w-96 md:max-h-96 md:top-auto md:left-auto">
          <div className="flex justify-end md:hidden">
            <div
              className="inline-flex items-center gap-x-2 border-2 rounded-lg bg-white text-gray-950 font-bold text-sm px-2"
              onClick={() => toggleVisible(false)}
            >
              <p>Close</p>
              <FontAwesomeIcon
                className="text-red-700 text-2xl"
                icon={faClose}
              />
            </div>
          </div>
          {children}
        </div>
      )}
    </div>
  );
};
export default HeaderModal;
