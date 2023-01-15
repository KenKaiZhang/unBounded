const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:12302", { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("Connected to Database."));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "https://esociety.synology.me",
      "http://192.168.68.182",
      "http://127.0.0.1:5500",
    ],
  })
);

const storesRouter = require("./routes/stores");
app.use("/stores", storesRouter);

const productsRouter = require("./routes/products");
app.use("/products", productsRouter);

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

app.listen(6969, () => console.log("NewFinds server listening on port 6969."));
