import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import BrandRouter from "./routes/brands.js";
import ProductRouter from "./routes/products.js";
import CustomerRouter from "./routes/customers.js";
import OrderRouter from "./routes/orders.js";
import PaypalRouter from "./routes/paypal.js";
import EmailRouter from "./routes/email.js";
import WaitlistRouter from "./routes/waitlist.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["https://unboundedsw.com"],
  })
);

app.use("/brands", BrandRouter);
app.use("/products", ProductRouter);
app.use("/customers", CustomerRouter);
app.use("/orders", OrderRouter);
app.use("/paypal", PaypalRouter);
app.use("/email", EmailRouter);
app.use("/waitlist", WaitlistRouter);

app.listen(7222, () => console.log("New server listening on port 7222."));
