import { connect } from "@/lib/databaseManager";
import { Categorie } from "@/models/Categorie";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await connect();
  await isAdminRequest(req, res)
  

  if (method === "GET") {
    res.json(await Categorie.find().populate("parent"));
  }

  if (method === "POST") {
    const { name, parentCategorie, proprietes } = req.body;
    const categorieDoc = await Categorie.create({
      name,
      parent: parentCategorie || undefined,
      proprietes,
    });
    res.json(categorieDoc);
  }

  if (method === "PUT") {
    const { name, parentCategorie, proprietes, _id } = req.body;
    const categorieDoc = await Categorie.updateOne(
      { _id },
      {
        name,
        parent: parentCategorie || undefined,
        proprietes,
      }
    );
    res.json(categorieDoc);
  }

  if (method === "DELETE") {
    const { _id } = req.query;
    await Categorie.deleteOne({ _id });
    res.json("ok");
  }
}
