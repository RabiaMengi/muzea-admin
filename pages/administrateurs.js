import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";
import { prettyDate } from "@/lib/date";

function PageAdmins({ swal }) {
  const [email, setEmail] = useState("");
  const [adminEmails, setAdminEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function ajouterAdmin(ev) {
    ev.preventDefault();
    axios.post("/api/administrateurs", { email }).then((res) => {
      swal.fire({
        title: "Admin créé",
        icon: "success",
        confirmButtonColor: "#0E7490",
        confirmButtonHoverColor: "#1489B0",
      });
      setEmail("");
      loadAdmins();
    }).catch(err => {
        console.log(err)
        swal.fire({
        title: "Erreur!",
        text: err.response.data.message,
        icon: "Error",
      });
    })
  }
  function supprimerAdmin(_id, email) {
    swal
      .fire({
        title: "Êtes-vous sûr?",
        text: `Voulez-vous supprimer l'admin "${email}"`,
        showCancelButton: true,
        cancelButtonText: "Annuler",
        confirmButtonText: "Oui, supprimer!",
        confirmButtonColor: "#8B0000",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          axios.delete("/api/administrateurs?_id=" + _id).then(() => {
            swal.fire({
              title: "Admin supprimer!",
              icon: "success",
              confirmButtonColor: "#0E7490",
              confirmButtonHoverColor: "#1489B0",
            });
            loadAdmins();
          });
        }
      });
  }
  function loadAdmins() {
    setIsLoading(true);
    axios.get("/api/administrateurs").then((res) => {
      setAdminEmails(res.data);
      setIsLoading(false);
    });
  }
  useEffect(() => {
    loadAdmins();
  }, []);
  return (
    <Layout>
      <h1>Administrateurs</h1>
      <h2>Ajouter un administrateur</h2>
      <form onSubmit={ajouterAdmin}>
        <div className="flex flex-col w-80 gap-1 mb-2 sm:flex-row sm:w-auto ">
          <input
            type="text "
            className="mb-0"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            placeholder="courriel google"
          />
          <button type="submit" className="btn-primary py-1 whitespace-nowrap">
            Ajouter
          </button>
        </div>
      </form>

      <h2>Administrateurs existants</h2>
      <table className="basic">
        <thead>
          <tr>
            <th className="text-left">Courriels administrateurs</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={2}>
                <div className="py-4">
                  <Spinner fullwidth={true} />
                </div>
              </td>
            </tr>
          )}
          {adminEmails.length > 0 &&
            adminEmails.map((adminEmail) => (
              <tr key={adminEmail}>
                <td>{adminEmail.email}</td>
                <td className="hidden sm:table-cell">
                  {adminEmail.createdAt && prettyDate(adminEmail.createdAt)}
                </td>
                <td>
                  <button
                    onClick={() =>
                      supprimerAdmin(adminEmail._id, adminEmail.email)
                    }
                    className="btn-delete"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default withSwal(({ swal }) => <PageAdmins swal={swal} />);
