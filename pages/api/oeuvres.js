import { connect } from "@/lib/databaseManager";
import { Oeuvre } from "@/models/Oeuvre";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await connect();
  await isAdminRequest(req, res)
  

  if (method === "GET") {
    if (req.query?.id) {
      //si on veut modifier 1 id en particulier
      res.json(await Oeuvre.findOne({ _id: req.query.id }));
    } else {
      //si on veux retourner la page oeuvre au complet avec tt les oeuvres
      res.json(await Oeuvre.find());
    }
  }

  if (method === "POST") {
    const { name, description, price, images, categorie, proprietes } = req.body;
    const oeuvreDoc = await Oeuvre.create({
      name,
      description,
      price,
      images,
      categorie,
      proprietes,
    });
    res.json(oeuvreDoc);
  }

  if (method === "PUT") {
    const { name, description, price, images,categorie,proprietes, _id } = req.body;
    await Oeuvre.updateOne({ _id }, { name, description, price, images, categorie, proprietes });
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Oeuvre.deleteOne({ _id: req.query.id });
      res.json(true);
    }
  }
}
