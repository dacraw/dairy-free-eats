import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const HeaderModal = ({
  basic = false,
  children,
  headerText,
  triggerElement,
}: {
  basic?: boolean;
  children: React.ReactNode;
  headerText?: string;
  triggerElement: React.ReactNode;
}) => {
  const [visible, toggleVisible] = useState(false);
  const location = useLocation();

  const modalRef = useRef<HTMLDivElement>(null);

  const closeModal = useCallback(
    (e: MouseEvent) => {
      if (modalRef.current) {
        if (!modalRef.current.contains(e.target as Node)) toggleVisible(false);
      }
    },
    [visible]
  );

  useEffect(() => {
    document.addEventListener("click", closeModal);

    return () => document.removeEventListener("click", closeModal);
  }, []);

  useEffect(() => {
    toggleVisible(false);
  }, [location]);

  return (
    <div className="relative" ref={modalRef}>
      <div onClick={() => toggleVisible(!visible)} className="cursor-pointer">
        {triggerElement}
      </div>
      {visible && (
        <div
          className={`
            gray-background rounded p-4 fixed left-0 top-0 w-screen h-screen z-[100] 
            md:absolute md:right-0 ${
              basic ? "md:w-auto md:h-auto" : "md:w-96 md:max-h-96"
            } md:top-auto md:left-auto 
          `}
        >
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
