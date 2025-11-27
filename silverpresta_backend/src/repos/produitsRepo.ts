import { IProduit, Produit } from '@src/models/produits';
import mongoose from 'mongoose';

/******************************************************************************
                                Fonctions
******************************************************************************/

/**
 * Extraire un produit.
 *
 * @param {string} id - ID du produit à extraire
 * @returns {IProduit | null} - Produit si trouvé
 */
async function getOne(id: string): Promise<IProduit | null> {
  return await Produit.findById(id).exec();
}

/**
 * Extraire tous les produits.
 *
 * @returns {IProduit[]} - Tableau de produits
 */
async function getAll(): Promise<IProduit[]> {
  const produits = await Produit.find();
  return produits;
}

/**
 * Ajouter un produit.
 *
 * @param {IProduit} produit - Produit à ajouter
 */
async function add(produit: IProduit): Promise<void> {
  const nouveauProduit = new Produit(produit);
  await nouveauProduit.save();
}

/**
 * Mettre à jour un produit.
 *
 * @param {IProduit} produit - Produit à modifier
 */
async function update(produit: IProduit): Promise<void> {
  const produitAModifier = await Produit.findById(produit.id);

  if (produitAModifier === null) {
    throw new Error('Produit non trouvé');
  }

  produitAModifier.nom = produit.nom;
  produitAModifier.code = produit.code;
  produitAModifier.categorie = produit.categorie;
  produitAModifier.description = produit.description;
  produitAModifier.quantite = produit.quantite;
  produitAModifier.seuilReapprovisionnement = produit.seuilReapprovisionnement;
  produitAModifier.prixVente = produit.prixVente;
  produitAModifier.prixAchat = produit.prixAchat;
  produitAModifier.fournisseur = produit.fournisseur;
  produitAModifier.urlImage = produit.urlImage;
  produitAModifier.actif = produit.actif;
  produitAModifier.misAJourPar = produit.misAJourPar;
  produitAModifier.dateMiseAJour = new Date();

  await produitAModifier.save();
}

/**
 * Supprimer un produit.
 *
 * @param {string} id - ID du produit à supprimer
 */
async function delete_(id: string): Promise<void> {
  await Produit.deleteOne({ _id: id });
  
}

/**
 * Retourner des produits avec filtres
 * @param filtres Les filtres à appliquer (n'importe quoi)
 * @return Une Promise qui, une fois résolue, renvoie un tableau d'objets IProduit[] 
 * Sinon un tableau vide est retourné.
 */
//
function getWithFiltres(filtres: Record<string, any>): Promise<IProduit[]> {
  return Produit.find(filtres).exec();
}



/******************************************************************************
                                Export par défaut
******************************************************************************/

export default {
  getOne,
  getAll,
  add,
  update,
  delete: delete_,
  getWithFiltres,
} as const;
