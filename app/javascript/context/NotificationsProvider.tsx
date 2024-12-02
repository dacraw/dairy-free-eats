import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { createContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { v4 as uuidv4 } from "uuid";

export type NotificationsContextType = {
  addNotification: (message: string) => void;
};

export const NotificationsContext = createContext<NotificationsContextType>({
  addNotification: () => {},
});

const NotificationPopup = ({ message }: { message: string }) => {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFadeOut(true);
    }, 4700);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
      className={`${visible ? "block" : "hidden"} ${
        fadeOut ? "opacity-0" : ""
      } blue-background rounded transition-opacity duration-300 `}
    >
      <FontAwesomeIcon
        className="float-right p-2 hover:text-red-700 font-bold cursor-pointer"
        icon={faXmarkCircle}
        onClick={() => setVisible(false)}
      />
      <p className="break-normal text-sm p-2 row-start-1">{message}</p>
    </div>
  );
};

const NotificationsPopupList = ({
  notifications,
}: {
  notifications: { id: string; message: string }[];
}) => {
  return createPortal(
    <div
      id="notifications-popup-list"
      className="fixed top-0 inset-x-0 mx-auto w-40 bg-red text-white z-[110]"
    >
      {notifications.map(({ id, message }) => {
        return <NotificationPopup key={id} message={message} />;
      })}
    </div>,
    document.body
  );
};

const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<
    { id: string; message: string }[]
  >([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const addNotification: NotificationsContextType["addNotification"] = (
    message
  ) => {
    const id = uuidv4();
    setNotifications((prevNotifications) => {
      return [...prevNotifications, { id, message }];
    });

    const timeoutId = setTimeout(() => {
      removeNotification(id);
      const index = timeoutsRef.current.indexOf(timeoutId);
      if (index !== -1) {
        clearTimeout(timeoutsRef.current[index]);
        timeoutsRef.current.splice(index, 1);
      }
    }, 5000);

    timeoutsRef.current.push(timeoutId);
  };

  const removeNotification = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((n) => n.id !== id)
    );
  };

  if (!addNotification) return;

  return (
    <NotificationsContext.Provider value={{ addNotification }}>
      <NotificationsPopupList notifications={notifications} />
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsProvider;
