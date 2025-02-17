const { Server } = require("socket.io");

const messages = [];

const configureSockets = (server) => {
  const io = new Server(server, {
    cors: { origin: "http://localhost:5173" },
  });

  io.on("connection", (socket) => {
    console.log(`Usuario ${socket.id} conectado`);

    socket.on("userConnect", (data) => {
      let message = {
        id: socket.id,
        info: "connection",
        name: data.user,
        message: `usuario: ${data.user} - id: ${data.id} - Conectado`,
      };
      messages.push(message);
      io.emit("serverUserConnect", messages);
    });

    socket.on("userMessage", (data) => {
      const message = {
        id: socket.id,
        info: "message",
        name: data.user,
        message: data.message,
      };
      messages.push(message);
      io.emit("serverUserMessage", messages);
    });

    socket.on("typing", (data) => {
      socket.broadcast.emit("typing", data);
    });

    socket.on("disconnect", () => {
      console.log("Cliente desconectado:", socket.id);
    });
  });
};

module.exports = configureSockets;