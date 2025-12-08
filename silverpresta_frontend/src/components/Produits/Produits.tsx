// src/components/Produits/Produits.tsx
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { LoginContext } from '../../contexts/LoginContext';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

interface IProduit {
  _id: string;
  nom: string;
  code: string;
  categorie: string;
  quantite: number;
  prixVente: number;
}

const API_BASE_URL = 'http://localhost:3000';

function Produits() {
  const [produits, setProduits] = useState<IProduit[]>([]);
  const { isLoggedIn, token } = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    axios
      .get(`${API_BASE_URL}/api/produits/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProduits(response.data.produits as IProduit[]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [isLoggedIn, token, navigate]);

  function allerAjouter() {
    navigate('/produits/add');
  }

  function allerFiltrer() {
    navigate('/produits/filtrer');
  }

  function allerModifier(id: string) {
    navigate(`/produits/modifier/${id}`);
  }

  function allerSupprimer(id: string) {
    navigate(`/produits/supprimer/${id}`);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-8 px-4">
      {/* Titre + boutons d'action */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">
          <FormattedMessage
            id="produits.titre"
            defaultMessage="Liste des produits"
          />
        </h2>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={allerFiltrer}
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded-lg text-sm"
          >
            <FormattedMessage
              id="produits.bouton.filtrer"
              defaultMessage="Filtrer les produits"
            />
          </button>

          <button
            type="button"
            onClick={allerAjouter}
            className="bg-green-700 hover:bg-green-800 text-white font-semibold px-4 py-2 rounded-lg text-sm"
          >
            <FormattedMessage
              id="produits.bouton.ajouter"
              defaultMessage="Ajouter un produit"
            />
          </button>
        </div>
      </div>

      {/* Tableau */}
      <div className="w-full max-w-5xl overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">
                <FormattedMessage
                  id="produits.table.nom"
                  defaultMessage="Nom"
                />
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                <FormattedMessage
                  id="produits.table.code"
                  defaultMessage="Code"
                />
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                <FormattedMessage
                  id="produits.table.categorie"
                  defaultMessage="Catégorie"
                />
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right">
                <FormattedMessage
                  id="produits.table.quantite"
                  defaultMessage="Quantité"
                />
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right">
                <FormattedMessage
                  id="produits.table.prix"
                  defaultMessage="Prix ($)"
                />
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                <FormattedMessage
                  id="produits.table.actions"
                  defaultMessage="Actions"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {produits.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{p.nom}</td>
                <td className="border border-gray-300 px-4 py-2">{p.code}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {p.categorie}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {p.quantite}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {p.prixVente}$
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => allerModifier(p._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                    >
                      <FormattedMessage
                        id="produits.actions.modifier"
                        defaultMessage="Modifier"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => allerSupprimer(p._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                    >
                      <FormattedMessage
                        id="produits.actions.supprimer"
                        defaultMessage="Supprimer"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {produits.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="border border-gray-300 px-4 py-4 text-center text-gray-500"
                >
                  <FormattedMessage
                    id="produits.aucun"
                    defaultMessage="Aucun produit trouvé."
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Produits;
