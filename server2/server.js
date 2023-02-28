import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import BrandRouter from "./routes/brands.js";
import ProductRouter from "./routes/products.js";
import CustomerRouter from "./routes/customers.js";
import OrderRouter from "./routes/orders.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://127.0.0.1:5501"],
  })
);

app.use("/brands", BrandRouter);
app.use("/products", ProductRouter);
app.use("/customers", CustomerRouter);
app.use("/orders", OrderRouter);

app.listen(1232, () => console.log("New server listening on port 1232."));
