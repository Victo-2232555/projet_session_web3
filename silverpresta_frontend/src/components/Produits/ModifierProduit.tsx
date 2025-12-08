// src/components/Produits/ModifierProduit.tsx
import {
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { LoginContext } from '../../contexts/LoginContext';

const API_BASE_URL = 'http://localhost:3000';

interface IProduit {
  _id: string;
  id?: string; // pour l'update côté backend
  nom: string;
  code: string;
  categorie: string;
  description: string;
  quantite: number;
  prixVente: number;
  prixAchat: number;
  fournisseur: string;
}

function ModifierProduit() {
  const { id } = useParams<{ id: string }>();
  const { isLoggedIn, token } = useContext(LoginContext);
  const navigate = useNavigate();
  const [produit, setProduit] = useState<IProduit | null>(null);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (id) {
      axios
        .get(`${API_BASE_URL}/api/produits/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const p = response.data.produit as IProduit;
          // important : fournir id pour le backend (qui fait findById(produit.id))
          setProduit({ ...p, id: p._id });
        })
        .catch((err) => {
          console.error(err);
          setErreur('Impossible de charger le produit.');
        });
    }
  }, [id, isLoggedIn, token, navigate]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    if (!produit) return;
    const { name, value } = e.target;
    setProduit({ ...produit, [name]: value });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!produit) return;

    try {
      await axios.put(
        `${API_BASE_URL}/api/produits/update`,
        { produit },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      navigate('/produits');
    } catch (err) {
      console.error(err);
      setErreur('Erreur lors de la mise à jour du produit.');
    }
  }

  function annuler() {
    navigate('/produits');
  }

  if (!produit && !erreur) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Chargement du produit...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-4">Modifier un produit</h2>

        {erreur && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md px-3 py-2">
            {erreur}
          </div>
        )}

        {produit && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Ligne 1 : Nom + Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  name="nom"
                  value={produit.nom}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code
                </label>
                <input
                  name="code"
                  value={produit.code}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
              </div>
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <input
                name="categorie"
                value={produit.categorie}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={produit.description}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
            </div>

            {/* Quantité + Prix achat + Prix vente */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantité
                </label>
                <input
                  type="number"
                  name="quantite"
                  value={produit.quantite}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix d&apos;achat
                </label>
                <input
                  type="number"
                  name="prixAchat"
                  value={produit.prixAchat}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix de vente
                </label>
                <input
                  type="number"
                  name="prixVente"
                  value={produit.prixVente}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
              </div>
            </div>

            {/* Fournisseur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fournisseur
              </label>
              <input
                name="fournisseur"
                value={produit.fournisseur}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
            </div>

            {/* Boutons */}
            <div className="flex flex-col md:flex-row justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={annuler}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-green-700 hover:bg-green-800 text-sm font-semibold text-white"
              >
                Enregistrer
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ModifierProduit;
