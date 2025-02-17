const express = require("express");
const path = require("path");
const configureHandlebars = require("./config/handlebars");
const routes = require("./routes/index");

const app = express();

// Configuración de Handlebars
configureHandlebars(app);

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rutas
app.use("/", routes);

module.exports = app;