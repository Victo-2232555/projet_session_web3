// src/components/Produits/Produits.tsx
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { LoginContext } from '../../contexts/LoginContext';
import { useNavigate } from 'react-router-dom';

interface IProduit {
  _id: string;          // ← IMPORTANT : id Mongo
  nom: string;
  code: string;
  categorie: string;
  quantite: number;
  prixVente: number;
  // je peux ajouter d'autres champs si je veux les afficher :
  // description?: string;
  // seuilReapprovisionnement?: number;
  // prixAchat?: number;
  // fournisseur?: string;
  // actif?: boolean;
}

const API_BASE_URL = 'http://localhost:3000'; // adapte au port réel

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
        // response.data.produits vient du backend, on le typpe comme IProduit[]
        setProduits(response.data.produits as IProduit[]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [isLoggedIn, token, navigate]);

  return (
    <div>
      <h2>Liste des produits</h2>
      {produits.map((p) => (
        <div key={p._id}>
          {p.nom} - {p.code} - {p.categorie} - {p.quantite} - {p.prixVente}$
        </div>
      ))}
    </div>
  );
}

export default Produits;
