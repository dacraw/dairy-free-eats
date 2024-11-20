import consumer from "./consumer";

const connectToOrdersChannel = (
  orderId: number,
  chatElement: HTMLDivElement,
  currentUserId: number,
  currentUserIsAdmin: boolean
) =>
  consumer.subscriptions.create(
    {
      channel: "OrdersChannel",
      id: orderId,
    },
    {
      connected() {
        console.log("connected");
        // Called when the subscription is ready for use on the server
      },

      disconnected() {
        // Called when the subscription has been terminated by the server
        console.log("disconnected");
      },

      received(data) {
        // Called when there's incoming data on the websocket for this channel
        console.log(data);
        chatElement.insertAdjacentHTML(
          "beforeend",
          this.generateElementString(data)
        );
      },

      generateElementString({
        body,
        createdAt,
        userId,
        userIsAdmin,
      }: {
        body: string;
        createdAt: string;
        userId: number;
        userIsAdmin: boolean;
      }) {
        const utcDate = new Date(createdAt);
        const offset = utcDate.getTimezoneOffset();
        const localTime = new Date(utcDate.getTime() - offset);

        return `
          <div class="grid mb-4">
              <div class="p-2 rounded w-3/4 ${
                currentUserId === userId || (userIsAdmin && currentUserIsAdmin)
                  ? "justify-self-end bg-gray-800"
                  : "justify-self-start bg-blue-800"
              }">
                <p>${body}</p>
                <p class="text-sm">${localTime.toLocaleString()}</p>
              </div>
          </div>
        `;
      },
    }
  );

export default connectToOrdersChannel;
