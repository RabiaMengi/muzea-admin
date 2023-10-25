import Layout from "@/components/Layout";
import OeuvreForm from "@/components/FormulaireOeuvre";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";

export default function ModifierOeuvrePage() {
  const [infoOeuvre, setInfoOeuvre] = useState(null);
  const [charger, setCharger] = useState(false)

  // Dans router, on a query:id: "id d'art"
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    //si le id est undefined
    if (!id) {
      return;
    }
    // ici je récupère l'oeuvre à modifier dans la base de données par son ID et j'envoie la reponse
    setCharger(true)
    axios.get("/api/oeuvres?id=" + id).then((response) => {
      setInfoOeuvre(response.data);
      setCharger(false)
    });
  }, [id]);
  return (
    <Layout>
      <h1>Modifier une Œuvre </h1>
      {charger && (
        <Spinner fullwidth={true}/>
      )}
      {infoOeuvre && <OeuvreForm {...infoOeuvre} />}
    </Layout>
  );
}
