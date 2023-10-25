import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function FormulaireOeuvre({
  _id,
  name: existingName,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  categorie: assignedCategorie,
  proprietes: assignedProprietes,
}) {
  const [name, setName] = useState(existingName || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [categorie, setCategorie] = useState(assignedCategorie || "");
  const [proprietesOeuvre, setProprietesOeuvre] = useState(
    assignedProprietes || {}
  );
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [goToOeuvres, setGoToOeuvres] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  async function enregistrerOeuvre(ev) {
    ev.preventDefault();
    const data = {
      name,
      description,
      price,
      images,
      categorie,
      proprietes: proprietesOeuvre,
    };
    if (_id) {
      // Modifier
      await axios.put("/api/oeuvres", { ...data, _id });
    } else {
      // Créer
      await axios.post("/api/oeuvres", data);
    }
    setGoToOeuvres(true);
  }

  if (goToOeuvres) {
    router.push("/oeuvres");
  }

  async function telechargerImage(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setChargement(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/telechargement", data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setChargement(false);
    }
  }

  function updateImagesOrder(newImages) {
    setImages(newImages);
  }

  const changePropOeuvre = (propName, value) => {
    setProprietesOeuvre((prev) => {
      const newPropOeuvre = { ...prev };
      newPropOeuvre[propName] = value;
      return newPropOeuvre;
    });
  };

  function supprimerImage(index) {
    const nouvellesImages = [...images];
    nouvellesImages.splice(index, 1);
    setImages(nouvellesImages);
  }

  const propertiesToFill = [];
  if (categories.length > 0 && categorie) {
    let catInfo = categories.find(({ _id }) => _id === categorie);
    propertiesToFill.push(...catInfo.proprietes);
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo?.parent?._id
      );
      propertiesToFill.push(...parentCat.proprietes);
      catInfo = parentCat;
    }
  }

  return (
    <form onSubmit={enregistrerOeuvre}>
      <label>Nom de l'œuvre</label>
      <input
        type="text"
        value={name}
        onChange={(ev) => setName(ev.target.value)}
      />
      <label>Catégorie</label>
      <select
        value={categorie}
        onChange={(ev) => setCategorie(ev.target.value)}
      >
        <option value="">Non catégorisé</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
      </select>
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div key={p.name} className="">
            <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
            <div>
            <select
              value={proprietesOeuvre[p.name] || ""}
              onChange={(ev) => changePropOeuvre(p.name, ev.target.value)}
            >
              {p.values.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
            </div>  
          </div>
        ))}
      <label>Images</label>
      <div className="mb-2 flex flex-wrap gap-1">
  <ReactSortable
    list={images}
    className="flex flex-wrap gap-1"
    setList={updateImagesOrder}
  >
    {!!images?.length &&
      images.map((link, index) => (
        <div key={link} className="relative bg-white p-4 shadow-sm rounded-sm">
          <div className="h-24  shadow-sm rounded-sm border border-gray-200 ">
            <img src={link} alt={`Image ${index}`} className="rounded-md" />
          </div>
          <button
            className="absolute top-0 right-1 text-sm "
            onClick={() => supprimerImage(index)}
          >
            &#x2716;
          </button>
        </div>
      ))}
  </ReactSortable>
        {chargement && (
          <div className="h-24 p-1">
            <Spinner />
          </div>
        )}
        <label className="w-10 h-10 cursor-pointer  flex  items-center text-sm gap-1 bg-white justify-center rounded-lg text-cyan-900 border border-gray-200 shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <input
            type="file"
            onChange={telechargerImage}
            className="hidden"
          ></input>
        </label>
        {!images.length && <div>Aucune image pour cette œuvre</div>}
      </div>
      <label>Déscription</label>
      <textarea
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Prix</label>
      <input
        type="number"
        placeholder="Prix en (CAD)"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <div className="flex gap-2">
      <button type="submit" className="btn-primary">
        Enregistrer
      </button>
      <button
        type="button"  
        className="btn-default"
        onClick=
      {() => {
          setGoToOeuvres(true);
          setName(existingName || '');
          setDescription(existingDescription || '');
          setCategorie(assignedCategorie || '');
          setProprietesOeuvre(assignedProprietes || {});
          setPrice(existingPrice || '');
          setImages(existingImages || []);
        }}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
