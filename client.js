const socket = io("http://localhost:8000");
// This line initializes a Socket.IO client that connects to the server running at "http://localhost:8000". The socket variable will be used to send and receive messages between the client and server.

const form = document.getElementById("sendcontainer");
// This line selects an HTML element with the ID 'sendcontainer' and assigns it to the variable form. This element is likely a form in the HTML document.
const messageinput = document.getElementById("messageinp");
// his line selects an HTML element with the ID 'messageinp' and assigns it to the variable messageinput. This element is likely an input field where the user can type their messages.
const messagecontainer = document.querySelector(".cont");
// This line selects the first HTML element with the class 'cont' and assigns it to the variable messagecontainer. This element is likely a container where messages will be displayed.

var audio = new Audio("join.mp3");
var mp3 = new Audio("ting.mp3");
// these are used to play audio

const append = (message, position) => {
  const messageElement = document.createElement("div");
  // This creates a new div element in the DOM that will represent the message.

  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const formattedTime = `${hours}:${minutes}`;
  // I added a currentTime variable to get the current time using the Date object.
  // I extracted the hours and minutes from the current time.
  // I formatted the time as HH:mm (24-hour format).
  // I modified the innerText of the messageElement to include the formatted time along with the original message.

  messageElement.innerHTML = `${message}<br><span class="time">${formattedTime}</span>`;

  // Sets the inner text of the created div element to the provided message content.
  messageElement.classList.add("message");
  // Adds the CSS class 'message' to the message element. This class likely contains styling rules for formatting the message.
  messageElement.classList.add(position);
  // Adds another CSS class to the message element based on the specified position
  messagecontainer.append(messageElement);
  // Appends the created message element to a container in the DOM where messages are displayed. messagecontainer is assumed to be a reference to this container.
  if (position == "left") {
    audio.play();
  }
};

form.addEventListener("submit", (e) => {
  // his sets up an event listener on a form element (form). The listener is triggered when the form is submitted.
  e.preventDefault();
  // This prevents the default form submission behavior, which would typically result in a page reload
  const message = messageinput.value;
  // This retrieves the value entered into the message input field (messageinput).
  append(`You: ${message}`, "right");
  // This calls the append function (likely defined elsewhere in your code) to add the sent message to the chat interface. It displays the message with the prefix "You:" to indicate that it was sent by the current user. The 'right' parameter indicates that this message should be positioned on the right side of the chat interface, suggesting that it's a sent message.
  socket.emit("send", message);
  // This emits a 'send' event to the server using the Socket.IO connection (socket). It sends the message content along with the event.
  messageinput.value = " ";
  // After sending the message, this line clears the message input field, making it ready for the user to enter a new message.
});

// Use a different variable name instead of 'name' to avoid the deprecation warning
const userName = prompt("Enter your name to chat");

socket.emit("new-user-joined", userName);
// This line emits a 'new-user-joined' event to the server with the user's name. It informs the server that a new user has joined the chat and sends the user's name along with the event.

socket.on("user-joined", (userName) => {
  // This sets up a Socket.IO event listener on the client side. It listens for the 'user-joined' event from the server.
  append(`${userName} joined the chat`, "right");
  mp3.play();
});
// Inside the callback function, this line calls the append function (assumed to be defined elsewhere in your code) to add a message to the chat interface. The message is a notification that a user with the specified userName has joined the chat. The 'right' parameter suggests that this message should be positioned on the right side of the chat interface,

socket.on("receive", (data) => {
  append(`${data.userName}: ${data.message}`, "left");
});
// In summary, when the server emits a 'receive' event to the client, this code responds by updating the chat interface with a message received from another user. The message includes the sender's name and the actual message content. The positioning on the left side of the chat interface typically indicates that it's a message from another user.
socket.on("left", (userName) => {
  append(`${userName} left the chat`, "right");
});
// In summary, when the server emits a 'left' event to the client, this code responds by updating the chat interface with a notification about a user leaving the chat. The message indicates which user left, and the positioning on the right side of the chat
