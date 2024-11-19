import React, { useEffect, useRef } from "react";
import { connectToOrdersChannel } from "channels";

const OrderChat = () => {
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatRef.current) return;

    connectToOrdersChannel(54, chatRef.current);
  }, []);
  return (
    <div>
      <div className="bg-gray-200 p-4 text-gray-900 w-60 rounded" ref={chatRef}>
        <p className="">Hey this is an order chat.</p>
      </div>
    </div>
  );
};

export default OrderChat;
