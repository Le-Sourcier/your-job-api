const http = require("http");
const express = require("express");
const route = express.Router();
const app = express(http);
const server = http.createServer(app);
//Get path
const path = require("path");

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Open listener port for connexion
const PORT = process.env.PORT || 8000;

//Get socket connexion
// const route = require("./socket");

const { login, register, deleteUser } = require("./../model/model");
// app.use("/", login);

app.get("^/$|index.html", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.sendFile(path.join(__dirname, "..", "view", "index.html"));
});

//404 Page not found error
app.get("/*", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.sendFile(path.join(__dirname, "..", "error", "404.html"));
});

app.use("/", [login, register, deleteUser]);

module.exports = { app, server, express, PORT, path };
