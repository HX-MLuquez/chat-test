const http = require("http");
const app = require("./src/app");
const configureSockets = require("./src/sockets/socket");

const PORT = 8080;

// Crear servidor HTTP
const server = http.createServer(app);

// Configurar WebSockets
configureSockets(server);

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});