import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SupprimerOeuvrePage() {
  const router = useRouter();
  const [infoOeuvre, setInfoOeuvre] = useState();
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/oeuvres?id=" + id).then((response) => {
      setInfoOeuvre(response.data);
    });
  });
  function goBack() {
    router.push("/oeuvres");
  }
  async function supprimerOeuvre() {
    await axios.delete("/api/oeuvres?id=" + id);
    goBack();
  }

  return (
    <Layout>
      <h1 className="text-center">
        Voulez vous vraiment supprimer &nbsp;"{infoOeuvre?.name}"?
      </h1>
      <div className="flex gap-2 justify-center">
        <button onClick={supprimerOeuvre} className="btn-red">
          Oui
        </button>
        <button className="btn-default" onClick={goBack}>
          Non
        </button>
      </div>
    </Layout>
  );
}
