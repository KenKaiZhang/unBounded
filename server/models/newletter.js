import mongoose from "mongoose";

const NewsletterSchema = new mongoose.Schema({
  email: { type: String },
});

export default NewsletterSchema;
