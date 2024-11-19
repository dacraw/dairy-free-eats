import consumer from "./consumer";

const connectToOrdersChannel = (orderId: number, chatElement: HTMLDivElement) =>
  consumer.subscriptions.create(
    {
      channel: "OrdersChannel",
      id: orderId,
    },
    {
      connected() {
        // Called when the subscription is ready for use on the server
        // this.chatElement = chatElement;
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

      generateElementString(data: { body: string }) {
        return `
          <p>
            ${data["body"]}
          </p>
        `;
      },
    }
  );

export default connectToOrdersChannel;
