import { connect } from "@/lib/databaseManager";
import { Commande } from "@/models/Commande";

export default async function handler(req, res) {
    await connect()
    res.json(await Commande.find().sort({createdAt: -1}))
}