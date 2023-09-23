const { app, server, express, PORT, path } = require("../.env/server");

app.use(express.static(path.join(__dirname, "..", "view")));

app.use(express.json());

const route = express.Router();

// Start the HTTP server on the provided port
server.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);
});
