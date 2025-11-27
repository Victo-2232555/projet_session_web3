import { RouteError } from '@src/common/util/route-errors';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';

import UtilisateursRepo from '@src/repos/utilisateursRepo';
import { IUtilisateur, Utilisateur } from '@src/models/utilisateurs';

/******************************************************************************
                                Constantes
******************************************************************************/

export const UTILISATEUR_NON_TROUVE = 'Utilisateur non trouvé';

/******************************************************************************
                                Fonctions
******************************************************************************/

/**
 * Récupérer tous les utilisateurs
 */
function getAll(): Promise<IUtilisateur[]> {
  return UtilisateursRepo.getAll();
}

/**
 * Récupérer un utilisateur par ID
 */
function getOne(id: string): Promise<IUtilisateur | null> {
  return UtilisateursRepo.getOne(id);
}

/**
 * Ajouter un utilisateur
 */
function addOne(utilisateur: IUtilisateur): Promise<void> {
  return UtilisateursRepo.add(utilisateur);
}

/**
 * Mettre à jour un utilisateur
 */
async function updateOne(utilisateur: IUtilisateur): Promise<void> {
  const exists = await UtilisateursRepo.getOne(utilisateur.id);
  if (!exists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, UTILISATEUR_NON_TROUVE);
  }
  return UtilisateursRepo.update(utilisateur);
}

/**
 * Supprimer un utilisateur par son ID
 */
async function _delete(id: string): Promise<void> {
  const exists = await UtilisateursRepo.getOne(id);
  if (!exists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, UTILISATEUR_NON_TROUVE);
  }
  return UtilisateursRepo.delete(id);
}

/******************************************************************************
                                Export par défaut
******************************************************************************/

export default {
  getAll,
  getOne,
  addOne,
  updateOne,
  delete: _delete,
} as const;
