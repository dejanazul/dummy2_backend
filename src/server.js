// const dotenv = require("dotenv");
const http = require("http")
const app = require("./app.js");

// dotenv.config();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
