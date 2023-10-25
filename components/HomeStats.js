import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import frLocale from "date-fns/locale/fr";
import { format, subHours } from "date-fns";

export default function HomeStats() {
  const [commandes, setCommandes] = useState([]);
  const [charger, setCharger] = useState(false);

  useEffect(() => {
    setCharger(true);
    axios.get("/api/commandes").then((res) => {
      setCommandes(res.data);
      setCharger(false);
    });
  }, []);

  function totalCommandes(commandes) {
    let somme = 0;
    commandes.forEach((commande) => {
      const { line_items } = commande;
      line_items.forEach((li) => {
        const lineSum = (li.quantity * li.price_data.unit_amount) / 100;
        somme += lineSum;
      });
    });
    return somme.toLocaleString();
  }

  if (charger) {
    return (
      <div className="my-o4">
        <Spinner fullwidth={true} />
      </div>
    );
  }

  const commandesAuj = commandes.filter(
    (c) => new Date(c.createdAt) > subHours(new Date(), 24)
  );
  const commandesSemaine = commandes.filter(
    (c) => new Date(c.createdAt) > subHours(new Date(), 24 * 7)
  );
  const CommandesMois = commandes.filter(
    (c) => new Date(c.createdAt) > subHours(new Date(), 24 * 30)
  );

  const dateDuJour = format(new Date(), "EEEE, d MMMM y", { locale: frLocale });
  return (
    <div>
      <h2 className="text-center mb-5 mt-10">
        Date du jour:
        <div className="date">{dateDuJour}</div>
      </h2>
      <hr />
      <h2>Commandes</h2>
      <div className="carre-grid">
        <div className="carre">
          <h3 className="carre-titre ">Aujourd'hui</h3>
          <div className="carre-nb">{commandesAuj.length}</div>
          <div className="desc">
            {commandesAuj.length} commande(s) aujourd'hui
          </div>
        </div>
        <div className="carre">
          <h3 className="carre-titre">Cette Semaine</h3>
          <div className="carre-nb">{commandesSemaine.length}</div>
          <div className="desc">
            {commandesSemaine.length} commande(s) cette semaine
          </div>
        </div>
        <div className="carre">
          <h3 className="carre-titre">Ce mois</h3>
          <div className="carre-nb">{CommandesMois.length}</div>
          <div className="desc">
            {CommandesMois.length} commande(s) ce mois
          </div>
        </div>
      </div>
      <br />
      <hr className="border " />

      <h2>Revenue</h2>
      <div className="carre-grid">
        <div className="carre">
          <h3 className="carre-titre ">Aujourd'hui</h3>
          <div className="carre-nb">{totalCommandes(commandesAuj)} $</div>
        </div>
        <div className="carre">
          <h3 className="carre-titre">Cette Semaine</h3>
          <div className="carre-nb">{totalCommandes(commandesSemaine)} $</div>
        </div>
        <div className="carre">
          <h3 className="carre-titre">Ce mois</h3>
          <div className="carre-nb">{totalCommandes(CommandesMois)} $</div>
        </div>
      </div>
    </div>
  );
}
