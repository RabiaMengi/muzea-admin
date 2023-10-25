import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import { prettyDate } from "@/lib/date";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Commandes() {
  const [commandes, setCommandes] = useState([]);
  const [charger, setCharger] = useState(false)
  useEffect(() => {
    setCharger(true)
    axios.get("/api/commandes").then((response) => {
      setCommandes(response.data);
      setCharger(false)
    });
  }, []);
  return (
    <Layout>
      <h1>Commandes</h1>
      <table className="commande ">
        <thead>
          <tr>
            <th>Date</th>
            <th>Statut de paiement</th>
            <th>Client</th>
            <th>Œuvres</th>
          </tr>
        </thead>
        <tbody>
          {charger && (
            <tr>
            <td colSpan={4}>
            <div className="py-4">
              <Spinner fullwidth={true} />
            </div>
            </td>
          </tr>
          )}
          {commandes.length > 0 &&
            commandes.map((commande) => (
              <tr key={commande}>
                <td>
                  <strong>{prettyDate(commande.createdAt)}</strong>
                </td>
                <td
                  className={commande.payer ? "text-green-600" : "text-red-600"}
                >
                  {commande.payer ? "PAYÉE" : "NON PAYÉE"}
                </td>
                <td>
                  {commande.nom}
                  <br />
                  {commande.courriel}
                  <br />
                  {commande.adresse}
                  <br />
                  {commande.ville}
                  {commande.codePostal}
                  {commande.pays}
                </td>
                <td>
                  {commande.line_items.map((line) => (
                    <>
                      {line.quantity} x {line.price_data.product_data.name}{" "}
                      <br />
                    </>
                  ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
