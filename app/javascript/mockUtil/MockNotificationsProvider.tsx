import React from "react";
import { NotificationsContext } from "context/NotificationsProvider";

export const mockAddNotification = jest.fn();

const MockNotificationsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <NotificationsContext.Provider
      value={{ addNotification: mockAddNotification }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export default MockNotificationsProvider;
