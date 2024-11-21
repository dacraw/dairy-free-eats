import React from "react";

const AdminDashboardIndex = () => {
  return (
    <div>
      <p className="mb-6">Select a navigation option from above.</p>

      <div>
        <p className="mb-4">
          <strong className="font-bold">ORDERS: </strong>View all orders placed
          by a user, whether a guest or a user registered on this site.
        </p>
        <p className="mb-4">
          <strong className="font-bold">ORDER CHATS: </strong>View order chat
          panels for any chat that is not completed. Only the user that placed
          the order and any admin can send messages in this chat.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboardIndex;
