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
          <div style="display: grid; margin-bottom: 1rem;">
              <div style="padding: .5rem; border-radius: .25rem; width: 75%; ${
                currentUserId === userId || (userIsAdmin && currentUserIsAdmin)
                  ? "justify-self: end; background-color: #1f2937;"
                  : "justify-self: start; background-color: #1e40af;"
              }">
                <p>${body}</p>
                <p style="font-size: .875rem">${localTime.toLocaleString()}</p>
              </div>
          </div>
        `;
      },
    }
  );

export default connectToOrdersChannel;
