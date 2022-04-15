const socket = io();

let userName;
let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message-area");
let typingMessage = document.querySelector(".typing_message");

do {
  userName = prompt("Please enter your name: ");
} while (!userName);

textarea.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    sendMessage(event.target.value);
  }
});

function sendMessage(text) {
  let msg = {
    user: userName,
    message: text.trim(),
  };

  addMessage(msg, "outgoing");
  textarea.value = "";
  scrollMessage();

  socket.emit("message", msg);
}

function addMessage(msg, type) {
  let messageDiv = document.createElement("div");
  let addClass = type;
  messageDiv.classList.add(addClass, "message");

  let messageTemplate = `
    <h4>${msg.username}</h4>
    <p>${msg.message}</p>
  `;

  messageDiv.innerHTML = messageTemplate;
  messageArea.appendChild(messageDiv);
  typingMessage.innerHTML = "";
}

// typing....

textarea.addEventListener("keypress", () => {
  socket.emit("typing", userName);
});

socket.on("typing", (name) => {
  typingMessage.innerHTML = `<p><em>${name} is typing a message...</em></p>`;
  setTimeout(() => {
    typingMessage.innerHTML = "";
  }, 3000);
});

socket.on("message", (msg) => {
  addMessage(msg, "incoming");
  scrollMessage();
});

socket.on("receive chat", (result) => {
  // console.log(result);
  result.forEach((item) => {
    addMessage(item, "incoming");
    scrollMessage();
  });
});

function scrollMessage() {
  messageArea.scrollTop = messageArea.scrollHeight;
}
