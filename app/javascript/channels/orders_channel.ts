import consumer from "./consumer";

const connectToOrdersChannel = (orderId: number, chatElement: HTMLDivElement) =>
  consumer.subscriptions.create(
    {
      channel: "OrdersChannel",
      id: orderId,
    },
    {
      connected() {
        console.log("connected");
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

      generateElementString({
        body,
        createdAt,
      }: {
        body: string;
        createdAt: string;
      }) {
        const utcDate = new Date(createdAt);
        const offset = utcDate.getTimezoneOffset();
        const localTime = new Date(utcDate.getTime() - offset);

        return `
          <div style="margin-bottom: 1rem;">
            <p>${body}</p>
            <p style="font-size: .875rem">${localTime.toLocaleString()}</p>
          </div>
        `;
      },
    }
  );

export default connectToOrdersChannel;
