// src/components/Produits/SupprimerProduit.tsx
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { LoginContext } from '../../contexts/LoginContext';

const API_BASE_URL = 'http://localhost:3000';

interface IProduit {
  _id: string;
  nom: string;
  code: string;
  categorie: string;
}

function SupprimerProduit() {
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
          setProduit(response.data.produit as IProduit);
        })
        .catch((err) => {
          console.error(err);
          setErreur('Impossible de charger le produit.');
        });
    }
  }, [id, isLoggedIn, token, navigate]);

  async function confirmerSuppression() {
    if (!id) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/produits/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/produits');
    } catch (err) {
      console.error(err);
      setErreur('Erreur lors de la suppression du produit.');
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
      <div className="w-full max-w-xl bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-4">Supprimer un produit</h2>

        {erreur && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md px-3 py-2">
            {erreur}
          </div>
        )}

        {produit && (
          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
              <p className="text-sm text-gray-700 mb-1">
                Vous êtes sur le point de supprimer le produit&nbsp;:
              </p>
              <p className="font-semibold text-gray-900">
                {produit.nom} <span className="text-gray-500">({produit.code})</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Catégorie : {produit.categorie}
              </p>
            </div>

            <p className="text-sm text-red-700">
              Cette action est irréversible. Voulez-vous vraiment continuer ?
            </p>

            <div className="flex flex-col md:flex-row justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={annuler}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmerSuppression}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-sm font-semibold text-white"
              >
                Oui, supprimer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SupprimerProduit;
