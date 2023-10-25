import { connect } from "@/lib/databaseManager";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Admin } from "@/models/Admin";

export default async function handle(req, res) {
  await connect();
  await isAdminRequest(req, res);

  if (req.method === 'POST') {
    const {email} = req.body;
    if (await Admin.findOne({email})) {
      res.status(400).json({message:'Cet admin existe déjà!'});
    } else {
      res.json(await Admin.create({email}));
    }
  }

  if (req.method === 'DELETE') {
    const {_id} = req.query
    
    await Admin.findByIdAndDelete(_id)
    res.json(true)

  }

  if (req.method === "GET") {
    res.json(await Admin.find());
  }
}
