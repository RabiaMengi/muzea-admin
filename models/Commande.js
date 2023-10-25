import { model, models, Schema } from "mongoose";

const CommandeSchema = new Schema(
  {
    line_items: Object,
    nom: String,
    courriel: String,
    adresse: String,
    ville: String,
    codePostal: String,
    pays: String,
    payer: Boolean,
  },
  {
    timestamps: true,
  }
);

export const Commande = models?.Commande || model("Commande", CommandeSchema);