import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const ConfirmButton: React.FC<{
  actionText: string;
  buttonText: string;
  buttonClassName?: string;
  action: () => void;
}> = ({ action, buttonText, actionText, buttonClassName }) => {
  const [show, toggleShow] = useState(false);

  useEffect(() => {
    if (show) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      if (document.body.classList.contains("overflow-hidden")) {
        document.body.classList.remove("overflow-hidden");
      }
    };
  }, [show]);

  return (
    <div className="text-center select-none">
      <button
        className={`${buttonClassName} whitespace-pre`}
        onClick={() => toggleShow(true)}
      >
        {buttonText}
      </button>
      {createPortal(
        <div
          data-testid="confirm-button-modal"
          className={`${
            show ? "fixed" : "hidden"
          } gray-background top-0 left-0  flex justify-center items-center w-screen h-screen z-[5000]`}
        >
          <div className="dark-gray-background rounded shadow m-4 p-4">
            <p>Please confirm that you would like to continue this action:</p>

            {actionText && <p className="font-bold my-4">{actionText}</p>}

            <div className="flex gap-4 justify-center">
              <button className="green-button" onClick={action}>
                Confirm
              </button>
              <button className="red-button" onClick={() => toggleShow(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ConfirmButton;
