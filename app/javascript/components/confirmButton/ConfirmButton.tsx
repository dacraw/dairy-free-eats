import React, { useEffect, useState } from "react";

const ConfirmButton: React.FC<{
  actionText?: string;
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
  }, [show]);

  return (
    <div className="text-center select-none ">
      <div className={buttonClassName} onClick={() => toggleShow(true)}>
        <span>{buttonText}</span>
      </div>
      <div
        className={`${
          show ? "fixed" : "hidden"
        } bg-gray-400/50 top-0 left-0 border-gray-200  flex justify-center items-center w-full h-full`}
      >
        <div className="bg-gray-700 rounded border-4 p-4 z-50">
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
      </div>
    </div>
  );
};

export default ConfirmButton;
