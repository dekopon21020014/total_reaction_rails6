import consumer from "./consumer"

consumer.subscriptions.create("ReactionChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    // Called when there's incoming data on the websocket for this channel
    const html = `<p>${data.content.text}</p>`;
    const messages = document.getElementsByClassName('reactions');
    const newMessage = document.getElementById('message_text');
    messages.insertAdjacentHTML('afterbegin', html);
    newMessage.value='';
  }
});
