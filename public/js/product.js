//const fs = require("fs").promises;

const btnSubmit = document.getElementById("btn-submit");
const title = document.getElementById("title");
const price = document.getElementById("price");
const thumbnail = document.getElementById("thumbnail");
const contentTable = document.getElementById("content-table");
const btnSend = document.getElementById("btn-send");
const email = document.getElementById("email");
const message = document.getElementById("message");
const contentChat = document.getElementById("content-chat");

// conectar con socket io
const socket = io();

const clearInputs = () => {
  title.value = "";
  price.value = "";
  thumbnail.value = "";
};

const renderEmpty = () => {
  const rowElement = document.createElement("tr");
  rowElement.setAttribute("id", "empty");
  rowElement.innerHTML = `
    <td class="empty" colspan="3">No se encontraron productos</td>
  `;
  contentTable.appendChild(rowElement);
};

const render = (data) => {
  if (document.getElementById("empty")) {
    contentTable.removeChild(document.getElementById("empty"));
  }
  const rowElement = document.createElement("tr");
  rowElement.innerHTML = `
    <td>${data.title}</td>
    <td>$${data.price}</td>
    <td><img src="${data.thumbnail}" width="50px"/></td>
  `;
  contentTable.appendChild(rowElement);
};

socket.on("send_products", (data) => {
  if (data.length !== 0) {
    data.forEach((element) => {
      render(element);
    });
  } else {
    renderEmpty();
  }
});

socket.on("product", render);

btnSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  const product = {
    title: title.value,
    price: price.value,
    thumbnail: thumbnail.value,
  };

  socket.emit("product", product);
  render(product);
  clearInputs();
});

const renderChat = (data) => {
  const msgElement = document.createElement("div");
  msgElement.innerHTML = `
    <span class="span-email">${data.email}&nbsp;</span><span class="span-fecha">[${data.date}]&nbsp;</span><span class="span-message">:&nbsp;${data.message}</span>
  `;
  contentChat.appendChild(msgElement);
};

btnSend.addEventListener("click", (e) => {
  e.preventDefault();
  const chat = {
    email: email.value,
    message: message.value,
    date: moment().format("DD/MM/YYYY hh:mm:ss"),
  };

  socket.emit("message", chat);
  renderChat(chat);
  message.value = "";
});

socket.on("send_messages", async (data) => {
  console.log(data);
  data.forEach((element) => {
    renderChat(element);
  });
});

socket.on("message", renderChat);
