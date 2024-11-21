import React from "react";
import { connectToOrdersChannel } from "channels";
import {
  OrderMessage,
  useCreateOrderMessageMutation,
  useFetchOrderMessagesQuery,
} from "graphql/types";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";

const OrderChatMessage = ({
  currentUserId,
  currentUserIsAdmin,
  message,
}: {
  currentUserId: number;
  message: Pick<OrderMessage, "createdAt" | "body" | "userId" | "userIsAdmin">;
  currentUserIsAdmin: boolean;
}) => {
  const utcDate = new Date(message.createdAt);
  const offset = utcDate.getTimezoneOffset();
  const localTime = new Date(utcDate.getTime() - offset);

  return (
    <div className={`grid mb-4`}>
      <div
        className={`p-2 rounded w-3/4 ${
          currentUserId === message.userId ||
          (message.userIsAdmin && currentUserIsAdmin)
            ? "justify-self-end bg-gray-800"
            : "justify-self-start bg-blue-800"
        }`}
      >
        <p>{message.body}</p>
        <p className="text-sm">{localTime.toLocaleString()}</p>
      </div>
    </div>
  );
};

const OrderChatMessageForm = ({
  currentUserId,

  orderId,
}: {
  currentUserId: number;
  orderId: number;
}) => {
  const [
    createOrderMessage,
    { data: createOrderMessageData, loading: createOrderMessageLoading },
  ] = useCreateOrderMessageMutation();

  const messageRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset, setFocus, formState } = useForm<{
    message: string;
  }>();

  const { ref, ...rest } = register("message");

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.focus({ preventScroll: true });
    }
  }, []);

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(async (data) => {
        await createOrderMessage({
          variables: {
            input: {
              createOrderMessageInputType: {
                orderId,
                userId: currentUserId,
                body: data?.message,
              },
            },
          },
        });

        reset();
      })}
    >
      <input
        {...rest}
        name="message"
        autoComplete="off"
        ref={(e) => {
          ref(e);
          messageRef.current = e;
        }}
        className="block w-full bg-gray-200 mb-4"
      />
      <button className="blue-button w-full">Submit Message</button>
    </form>
  );
};

const OrderChat = ({
  orderId,
  currentUserId,
  currentUserIsAdmin,
  hideChatsOnSelect = true,
}: {
  orderId: string;
  currentUserId: number;
  currentUserIsAdmin: boolean;
  hideChatsOnSelect?: boolean;
}) => {
  const chatRef = useRef<HTMLDivElement>(null);

  const { data, loading, refetch } = useFetchOrderMessagesQuery({
    variables: { orderId },
  });

  useEffect(() => {
    refetch();
  }, [currentUserId]);

  useEffect(() => {
    if (!chatRef.current) return;

    const connection = connectToOrdersChannel(
      parseInt(orderId),
      chatRef.current,
      currentUserId,
      currentUserIsAdmin
    );

    return () => {
      connection.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!chatRef.current) return;
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    };

    const observer = new MutationObserver(handleScroll);

    if (chatRef.current) {
      observer.observe(chatRef.current, { childList: true });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const [visible, setVisible] = useState(false);
  const toggleVisibilityRef = useRef<HTMLParagraphElement>(null);
  const closeChat = (e: MouseEvent) => {
    if (chatRef.current && toggleVisibilityRef.current) {
      // check if the click is outside the component, but allow the panel to be opened initially
      // this also allows the submit button and input element to be clicked w/o closing the chat panel
      if (
        !chatRef.current.contains(e.target as HTMLElement) &&
        !toggleVisibilityRef.current.contains(e.target as HTMLElement)
      ) {
        setVisible(false);
      }
    }
  };

  useEffect(() => {
    if (hideChatsOnSelect) {
      document.addEventListener("click", closeChat);

      return () => document.removeEventListener("click", closeChat);
    }
  }, []);

  return (
    <div>
      <div
        className="bg-gray-900  text-gray-200 w-60 rounded"
        ref={toggleVisibilityRef}
      >
        <p
          className="text-center bg-gray-800 rounded py-2 cursor-pointer "
          onClick={() => {
            setVisible(!visible);
            if (toggleVisibilityRef.current) {
              toggleVisibilityRef.current.scrollIntoView({
                behavior: "smooth",
              });
            }
          }}
        >
          Order #{orderId} Chat
        </p>
        <div
          id="chat"
          ref={chatRef}
          onAnimationStart={() => {
            if (chatRef.current) {
              chatRef.current.scrollTop = chatRef.current.scrollHeight;
            }
            if (toggleVisibilityRef.current) {
              toggleVisibilityRef.current.scrollIntoView({
                behavior: "smooth",
              });
            }
          }}
          onAnimationEnd={() => {}}
          className={`overflow-auto h-96 hidden ${
            visible ? "animate-slide-up" : ""
          }`}
        >
          <p className="text-center text-xs bg-gray-800 rounded p-2 mb-4">
            This chat will be available after an order is received and until it
            is completed. You can click "Admin Demo" from the navigation above
            and find the order chat in the dashboard's order chats to send
            messages. Using incognito mode in a new browser will make this
            easier.
          </p>
          {loading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} />
              <p>Loading messages...</p>
            </>
          ) : (
            <>
              {data?.orderMessages?.map((message) => {
                return (
                  <OrderChatMessage
                    currentUserIsAdmin={currentUserIsAdmin}
                    key={message.id}
                    message={message}
                    currentUserId={currentUserId}
                  />
                );
              })}
            </>
          )}
        </div>
        {visible && (
          <div className="p-4">
            <OrderChatMessageForm
              orderId={parseInt(orderId)}
              currentUserId={currentUserId}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderChat;
