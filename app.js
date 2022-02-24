const express = require("express");
const path = require("path");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

const engine = require("./engine/hbs");

const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 8080;

const products = [];
const contenido = [];

engine(app, path);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("main");
});

io.on("connection", (socket) => {
  console.log(`an user connected: ${socket.id}`);

  socket.on("product", (item) => {
    products.push(item);
    socket.broadcast.emit("product", item);
  });

  socket.emit("send_products", products);

  socket.on("message", (item) => {
    contenido.push(item);
    socket.broadcast.emit("message", item);
  });

  socket.emit("send_messages", contenido);
});

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
