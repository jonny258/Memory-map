const express = require("express");
const app = express();
const path = require("path");

const session = require("express-session");
const cors = require("cors");

const db = require("./config/connection");
const routes = require("./routes");

const PORT = process.env.PORT || 5500;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
  });
}


db.once("open", () => {
  console.log("MongoDB connected");
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
