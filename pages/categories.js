import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [editedCategorie, setEditedCategorie] = useState(null);
  const [name, setName] = useState("");
  const [parentCategorie, setParentCategorie] = useState("");
  const [categories, setCategories] = useState([]);
  const [proprietes, setProprietes] = useState([]);
  const [charger, setCharger] = useState(false)
  useEffect(() => {
    fetchCategories();
    
  }, []);
  function fetchCategories() {
    setCharger(true)
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
      setCharger(false)
    });
  }
  async function enregistrerCategorie(ev) {
    ev.preventDefault();
    const data = { 
      name, 
      parentCategorie, 
      proprietes:proprietes.map(p => ({
        name: p.name, 
        values:p.values.split(','),
      }))
    };
    if (editedCategorie) {
      data._id = editedCategorie._id;
      await axios.put("/api/categories", data);
      setEditedCategorie(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParentCategorie('')
    setProprietes([])
    fetchCategories();
  }
  function modifierCategorie(categorie) {
    setEditedCategorie(categorie);
    setName(categorie.name);
    setParentCategorie(categorie.parent?._id);
    setProprietes(categorie.proprietes.map(({name, values}) => ({
      name, 
      values:values.join(',')
    }))
    )
  }
  function deleteCategorie(categorie) {
    swal
      .fire({
        title: "Êtes-vous sûr?",
        text: `Voulez-vous supprimer la catégorie "${categorie.name}"`,
        showCancelButton: true,
        cancelButtonText: "Annuler",
        confirmButtonText: "Oui, supprimer!",
        confirmButtonColor: "#8B0000",
        reverseButton: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = categorie;
          await axios.delete("/api/categories?_id=" + _id, { _id });
          fetchCategories();
        }
      });
  }
  function ajouterPropriete() {
    setProprietes((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }
  function handleProprieteNameChange(index, propriete, newName) {
    setProprietes((prev) => {
      const proprietes = [...prev];
      proprietes[index].name = newName;
      return proprietes;
    });
  }
  function handleProprieteValuesChange(index, propriete, newValues) {
    setProprietes((prev) => {
      const proprietes = [...prev];
      proprietes[index].values = newValues;
      return proprietes;
    });
  }
  function removePropriete(indexToRemove) {
    setProprietes((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }
  return (
    <Layout>
      <h1>Catégories</h1>
      <label>
        {editedCategorie
          ? `Modifier Catégorie "${editedCategorie.name}" `
          : "Nouvelle catégorie"}
      </label>
      <form onSubmit={enregistrerCategorie}>
        <div className="flex flex-col w-80 gap-1 sm:flex-row sm:w-auto">
          <input
            type="text"
            placeholder={"Nom"}
            onChange={(ev) => setName(ev.target.value)}
            value={name}
          />
          <select
            onChange={(ev) => setParentCategorie(ev.target.value)}
            value={parentCategorie}
          >
            <option value="">Aucune catégorie parente</option>
            {categories.length > 0 &&
              categories.map((categorie) => (
                <option
                  value={categorie._id}
                  key={categorie._id}
                >
                  {categorie.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block mb-1 mt-4">Propriétés</label>
          <button
            onClick={ajouterPropriete}
            type="button"
            className="btn-default text-sm mb-2"
          >
            Ajouter une nouvelle propriété
          </button>
          {proprietes.length > 0 &&
            proprietes.map((propriete, index) => (
              <div
                key={index}
                className="flex flex-col w-80 gap-1 mb-2 sm:flex-row sm:w-auto"
              >
                <input
                  type="text"
                  value={propriete.name}
                  className="mb-0"
                  onChange={(ev) =>
                    handleProprieteNameChange(index, propriete, ev.target.value)
                  }
                  placeholder="Nom de propriété (exemple: couleur)"
                />
                <input
                  type="text"
                  className="mb-0"
                  value={propriete.values}
                  onChange={(ev) =>
                    handleProprieteValuesChange(
                      index,
                      propriete,
                      ev.target.value
                    )
                  }
                  placeholder="valeurs, séparées par des virgules"
                />
                <button
                  type="button"
                  onClick={() => removePropriete(index)}
                  className="btn-default"
                >
                  Retirer
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
        {editedCategorie && (
            <button 
              type="button"
              onClick={() => {
                setEditedCategorie(null)
                setName('')
                setParentCategorie('')
                setProprietes([])
        }}
              className="btn-default">Annuler
            </button>
          )} 
          <button 
            type="submit" 
            className="btn-primary py-1">
            Enregistrer
          </button>
        </div>
      </form>
      {!editedCategorie && (
        
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Nom des catégories</td>
              <td>Catégorie parente</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {charger && (
              <tr>
                <td colSpan={3}>
                <div className="py-4">
                  <Spinner fullwidth={true} />
                </div>
                </td>
              </tr>
            )}
            {categories.length > 0 &&
              categories.map((categorie) => (
                <tr key={categorie}>
                  <td>{categorie.name}</td>
                  <td>{categorie?.parent?.name}</td>
                  <td className="flex flex-col gap-2 mb-4 sm:flex-row justify-center sm:mb-0">
                    <button
                      onClick={() => modifierCategorie(categorie)}
                      className="btn-edit"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => deleteCategorie(categorie)}
                      className="btn-delete"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
