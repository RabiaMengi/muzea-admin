import mongoose, { model, Schema, models } from "mongoose";

const OeuvreSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [{ type: String }],
  categorie: {type:mongoose.Types.ObjectId, ref:'Categorie'},
  proprietes: {type: Object}
}, {
  timestamps: true,
});

export const Oeuvre = models?.Oeuvre || model("Oeuvre", OeuvreSchema);
