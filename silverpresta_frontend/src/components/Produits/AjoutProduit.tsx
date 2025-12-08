// src/components/Produits/AjoutProduit.tsx
import { useContext, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../contexts/LoginContext';

const API_BASE_URL = 'http://localhost:3000';

// Structure du formulaire côté frontend
interface IFormProduit {
  nom: string;
  code: string;
  categorie: string;
  quantite: string;   // string dans le formulaire (on convertira en nombre)
  prixVente: string;  // idem
}

function AjoutProduit() {
  const { isLoggedIn, token } = useContext(LoginContext);
  const navigate = useNavigate();

  const [form, setForm] = useState<IFormProduit>({
    nom: '',
    code: '',
    categorie: '',
    quantite: '',
    prixVente: '',
  });

  const [erreurs, setErreurs] = useState<Partial<IFormProduit>>({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const champ = e.target.name;
    const valeur = e.target.value;

    setForm((ancienFormulaire) => ({
      ...ancienFormulaire,
      [champ]: valeur,
    }));

    setErreurs((anciennesErreurs) => ({
      ...anciennesErreurs,
      [champ]: '',
    }));
  }

  function validerFormulaire(): boolean {
    const nouveauxErreurs: Partial<IFormProduit> = {};

    if (!form.nom.trim()) {
      nouveauxErreurs.nom = 'Le nom du produit est requis.';
    }

    if (!form.code.trim()) {
      nouveauxErreurs.code = 'Le code du produit est requis.';
    }

    if (!form.categorie.trim()) {
      nouveauxErreurs.categorie = 'La catégorie est obligatoire.';
    }

    const quantiteNum = Number(form.quantite);
    if (!form.quantite.trim() || isNaN(quantiteNum) || quantiteNum < 0) {
      nouveauxErreurs.quantite = 'La quantité doit être un nombre positif ou nul.';
    }

    const prixNum = Number(form.prixVente);
    if (!form.prixVente.trim() || isNaN(prixNum) || prixNum <= 0) {
      nouveauxErreurs.prixVente = 'Le prix de vente doit être un nombre supérieur à 0.';
    }

    setErreurs(nouveauxErreurs);
    return Object.keys(nouveauxErreurs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage('');

    if (!validerFormulaire()) {
      return;
    }

    try {
      // 👉 Données utiles pour le produit
      const produitPayload = {
        nom: form.nom.trim(),
        code: form.code.trim(),
        categorie: form.categorie.trim(),
        quantite: Number(form.quantite),
        prixVente: Number(form.prixVente),
      };

      console.log('Payload produit côté front :', produitPayload);

      // ❗ IMPORTANT : on enveloppe dans { produit: ... }
      // car le backend utilise probablement req.body.produit
      const response = await axios.post(
        `${API_BASE_URL}/api/produits/add`,
        { produit: produitPayload },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('Réponse backend:', response.data);

      setMessage('Produit ajouté avec succès.');

      setForm({
        nom: '',
        code: '',
        categorie: '',
        quantite: '',
        prixVente: '',
      });
      setErreurs({});
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        console.log('Erreur backend:', error.response.data);
        setMessage(error.response.data.message || "Erreur lors de l'ajout du produit.");
      } else {
        console.error(error);
        setMessage("Erreur lors de l'ajout du produit.");
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Ajouter un produit
        </h2>

        {message && (
          <p className="mb-4 text-center text-sm text-blue-600">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du produit
            </label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {erreurs.nom && (
              <p className="text-xs text-red-600 mt-1">{erreurs.nom}</p>
            )}
          </div>

          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code
            </label>
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {erreurs.code && (
              <p className="text-xs text-red-600 mt-1">{erreurs.code}</p>
            )}
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <input
              type="text"
              name="categorie"
              value={form.categorie}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {erreurs.categorie && (
              <p className="text-xs text-red-600 mt-1">{erreurs.categorie}</p>
            )}
          </div>

          {/* Quantité */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantité en stock
            </label>
            <input
              type="number"
              name="quantite"
              value={form.quantite}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={0}
            />
            {erreurs.quantite && (
              <p className="text-xs text-red-600 mt-1">{erreurs.quantite}</p>
            )}
          </div>

          {/* Prix de vente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prix de vente ($)
            </label>
            <input
              type="number"
              step="0.01"
              name="prixVente"
              value={form.prixVente}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={0}
            />
            {erreurs.prixVente && (
              <p className="text-xs text-red-600 mt-1">{erreurs.prixVente}</p>
            )}
          </div>

          {/* Boutons */}
          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => navigate('/produits')}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              ← Retour à la liste
            </button>

            <button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white font-semibold text-sm px-5 py-2 rounded-lg"
            >
              Enregistrer le produit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AjoutProduit;
