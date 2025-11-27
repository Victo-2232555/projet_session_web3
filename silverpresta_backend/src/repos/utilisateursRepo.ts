import { IUtilisateur, Utilisateur } from '@src/models/utilisateurs';
import mongoose from 'mongoose';

/******************************************************************************
                                Fonctions
******************************************************************************/

/**
 * Récupérer un utilisateur par ID
 *
 * @param {string} id - ID de l'utilisateur
 * @returns {IUtilisateur | null} - L'utilisateur si trouvé
 */
async function getOne(id: string): Promise<IUtilisateur | null> {
  const utilisateur = await Utilisateur.findById(id);
  return utilisateur;
}



/**
 * Récupérer tous les utilisateurs
 *
 * @returns {IUtilisateur[]} - Tableau de tous les utilisateurs
 */
async function getAll(): Promise<IUtilisateur[]> {
  const utilisateurs = await Utilisateur.find();
  return utilisateurs;
}

/**
 * Ajouter un utilisateur
 *
 * @param {IUtilisateur} utilisateur - L'utilisateur à ajouter
 */
async function add(utilisateur: IUtilisateur): Promise<void> {
  const nouvelUtilisateur = new Utilisateur(utilisateur);
  await nouvelUtilisateur.save();
}

/**
 * Mettre à jour un utilisateur existant
 *
 * @param {IUtilisateur} utilisateur - L'utilisateur à modifier
 */
async function update(utilisateur: IUtilisateur): Promise<void> {
  const utilisateurAModifier = await Utilisateur.findById(utilisateur.id);
  if (!utilisateurAModifier) {
    throw new Error('Utilisateur non trouvé');
  }

  utilisateurAModifier.nom = utilisateur.nom;
  utilisateurAModifier.prenom = utilisateur.prenom;
  utilisateurAModifier.courriel = utilisateur.courriel;
  utilisateurAModifier.mot_de_passe = utilisateur.mot_de_passe;
  utilisateurAModifier.role = utilisateur.role;
  utilisateurAModifier.actif = utilisateur.actif;

  await utilisateurAModifier.save();
}

/**
 * Supprimer un utilisateur
 *
 * @param {string} id - ID de l'utilisateur à supprimer
 */
async function delete_(id: string): Promise<void> {
  await Utilisateur.deleteOne({ id });
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
} as const;
