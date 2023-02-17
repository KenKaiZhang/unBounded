const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", true);
const username = process.env.MONGO_USER_NAME;
const password = process.env.MONGO_USER_PASSWORD;
mongoose.connect(
  `mongodb+srv://${username}:${password}@blankie.50plygc.mongodb.net/unboundedAlpha?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
  }
);

const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("Connected to Database."));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["https://unboundedsw.com"],
  })
);

const storesRouter = require("./routes/stores");
app.use("/stores", storesRouter);

const productsRouter = require("./routes/products");
app.use("/products", productsRouter);

const customersRouter = require("./routes/customers");
app.use("/customers", customersRouter);

const ordersRouter = require("./routes/orders");
app.use("/orders", ordersRouter);

const paypalRouter = require("./routes/paypal");
app.use("/paypal", paypalRouter);
const emailRouter = require("./routes/email");
app.use("/email", emailRouter);

app.listen(7222, () => console.log("unBounded server listening on port 7222."));
