import mongoose from "mongoose";
import * as dotenv from "dotenv";
import BrandSchema from "./models/brand.js";
import CartSchema from "./models/cart.js";
import CustomerSchema from "./models/customer.js";
import ProductSchema from "./models/product.js";
import OrderSchema from "./models/order.js";
import PartnerSchema from "./models/partner.js";

dotenv.config();

const username = process.env.MONGO_USER_NAME;
const password = process.env.MONGO_USER_PASSWORD;
const database = mongoose.createConnection(
  `mongodb+srv://${username}:${password}@blankie.50plygc.mongodb.net/unBoundedData?retryWrites=true&w=majority`
);
const Brand = database.model("Brand", BrandSchema);
const Cart = database.model("Cart", CartSchema);
const Customer = database.model("Customer", CustomerSchema);
const Order = database.model("Order", OrderSchema);
const Product = database.model("Product", ProductSchema);
const Partner = database.model("Partner", PartnerSchema);

database.on("error", (err) => console.error(err));
database.once("open", () => console.log("Connected to Database."));

export { Brand, Customer, Product, Cart, Order, Partner };
