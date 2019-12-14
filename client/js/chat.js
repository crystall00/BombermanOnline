const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

function message(from, message) {
    this.from = from;
    this.message = message;
}

const BOT_IMG = "assets/player/bot/bot_50x50.png";
const BOT_NAME = "BOT";
const PERSON_NAME = "Player 1";

$(msgerForm).submit(function(event){
    event.preventDefault();
    const msgText = msgerInput.value;
    if (!msgText) return;
    websocketGame.socket.emit('chatMessage', new message(currentUser, msgText));
    console.log("Send message: " + msgText);
    msgerInput.value = "";

    //botResponse();
});

function appendMessage(name, img, side, text) {
    const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
}

function botResponse(message) {
    appendMessage(BOT_NAME, BOT_IMG, "bot", message, true);
}

// Utils
function get(selector, root = document) {
    return root.querySelector(selector);
}

function formatDate(date) {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();

    return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}