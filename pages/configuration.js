import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Configuration({ swal }) {
  const [oeuvres, setOeuvres] = useState([]);
  const [vedetteId, setVedetteId] = useState("");
  const [charger, setCharger] = useState(false);
  const [fraisLivraison, setFraisLivraison] = useState("");

  useEffect(() => {
    setCharger(true);
    fetchAll().then(() => {
      setCharger(false);
    });
  }, []);

  async function fetchAll() {
    await axios.get("/api/oeuvres").then((res) => {
      setOeuvres(res.data);
     
    });

    await axios.get("/api/configurations?name=vedetteId").then((res) => {
      setVedetteId(res.data.value);
    });
    await axios.get("/api/configurations?name=fraisLivraison").then((res) => {
      setFraisLivraison(res.data.value);
    });
  }

  async function enregistrerConfig() {
    setCharger(true)
    await axios.put("/api/configurations", {
      name: "vedetteId",
      value: vedetteId,
    });

    await axios.put("/api/configurations", {
      name: "fraisLivraison",
      value: fraisLivraison,
    });
    setCharger(false)
    await swal.fire({
      title: "Vedette mis à jour!",
      icon: "success",
      confirmButtonColor: "#0E7490",
      confirmButtonHoverColor: "#1489B0",
    });
    
  }
  return (
    <Layout>
      <h1>Configuration</h1>
      {charger && <Spinner fullwidth={true} />}
      {!charger && (
        <>
          <label>Choisissez l'œuvre</label>
          <select
            value={vedetteId}
            onChange={(ev) => setVedetteId(ev.target.value)}
          >
            {oeuvres.length > 0 &&
              oeuvres.map((o) => <option value={o._id}>{o.name}</option>)}
          </select>
          <label>Frais de livraison (CAD)</label>
          <input
            type="number"
            value={fraisLivraison}
            onChange={(ev) => setFraisLivraison(ev.target.value)}
          />
          <div>
            <button onClick={enregistrerConfig} className="btn-primary">
              Enregistrer
            </button>
          </div>
        </>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }) => <Configuration swal={swal} />);
