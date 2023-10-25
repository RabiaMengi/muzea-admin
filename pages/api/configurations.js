import { connect } from "@/lib/databaseManager";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Configuration } from "@/models/Configuration";

export default async function handle(req, res) {
  await connect();
  await isAdminRequest(req, res);

  if (req.method === "PUT") {
    const { name, value } = req.body;
    const configDoc = await Configuration.findOne({ name });
    if (configDoc) {
      configDoc.value = value;
      await configDoc.save();
      res.json(configDoc)
    } else {
        res.json(await Configuration.create({name, value}))
    }
  }

  if (req.method === "GET") {
    const { name } = req.query;
    res.json(await Configuration.findOne({ name }));
  }
}
