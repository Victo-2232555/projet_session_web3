// src/components/Produits/FiltrerProduit.tsx
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { LoginContext } from '../../contexts/LoginContext';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000';

interface IProduit {
  _id: string;
  nom: string;
  code: string;
  categorie: string;
  quantite: number;
  prixVente: number;
}

function FiltrerProduit() {
  const { token, isLoggedIn } = useContext(LoginContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
        navigate('/login');
    }
    }, [isLoggedIn, navigate]);


  const [categorie, setCategorie] = useState('');
  const [quantiteMin, setQuantiteMin] = useState('');
  const [resultats, setResultats] = useState<IProduit[]>([]);
  const [erreur, setErreur] = useState('');

  async function filtrer() {
    try {
      let url = `${API_BASE_URL}/api/produits/filtres?`;

      if (categorie) url += `categorie=${categorie}&`;
      if (quantiteMin) url += `quantite=${quantiteMin}&`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setResultats(response.data.produits);
      setErreur('');
    } catch (err) {
      console.error(err);
      setErreur('Erreur lors du filtrage des produits.');
    }
  }

  function annuler() {
    navigate('/produits');
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-4">Filtrer les produits</h2>

        {erreur && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md px-3 py-2">
            {erreur}
          </div>
        )}

        {/* FORMULAIRE */}
        <div className="space-y-4">

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <input
              type="text"
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          {/* Quantité minimum */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantité minimum
            </label>
            <input
              type="number"
              value={quantiteMin}
              onChange={(e) => setQuantiteMin(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          {/* Boutons */}
          <div className="flex flex-col md:flex-row justify-end gap-2 pt-4">
            <button
              onClick={annuler}
              className="px-4 py-2 rounded-lg border border-gray-300
                         text-sm text-gray-700 hover:bg-gray-100"
            >
              Annuler
            </button>

            <button
              onClick={filtrer}
              className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800
                         text-sm font-semibold text-white"
            >
              Filtrer
            </button>
          </div>
        </div>

        {/* RÉSULTATS */}
        {resultats.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Résultats</h3>

            <div className="w-full overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">Nom</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Catégorie</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Quantité</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Prix ($)</th>
                  </tr>
                </thead>

                <tbody>
                  {resultats.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{p.nom}</td>
                      <td className="border px-4 py-2">{p.code}</td>
                      <td className="border px-4 py-2">{p.categorie}</td>
                      <td className="border px-4 py-2 text-right">{p.quantite}</td>
                      <td className="border px-4 py-2 text-right">{p.prixVente}$</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {resultats.length === 0 && (
          <p className="mt-6 text-gray-500 text-sm">Aucun résultat pour ces critères.</p>
        )}
      </div>
    </div>
  );
}

export default FiltrerProduit;
