//src/services/produitsService.ts
import { RouteError } from '@src/common/util/route-errors';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';

import ProduitsRepo from '@src/repos/produitsRepo';
import { IProduit } from '@src/models/produits';

/******************************************************************************
                                Constantes
******************************************************************************/

export const PRODUIT_NON_TROUVE = 'Produit non trouvé';

/******************************************************************************
                                Fonctions
******************************************************************************/

/**
 * Extraire tous les produits.
 */
function getAll(): Promise<IProduit[]> {
  return ProduitsRepo.getAll();
}

/**
 * Extraire un produit par son id.
 */
function getOne(id: string): Promise<IProduit | null> {
  return ProduitsRepo.getOne(id);
}


/**
 * Ajouter un produit.
 */
function addOne(produit: IProduit): Promise<void> {
  return ProduitsRepo.add(produit);
}

/**
 * Mettre à jour un produit.
 */
async function updateOne(produit: IProduit): Promise<void> {
  const persists = await ProduitsRepo.getOne(produit.id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, PRODUIT_NON_TROUVE);
  }
  return ProduitsRepo.update(produit);
}

/**
 * Supprimer un produit par son id.
 */
async function _delete(id: string): Promise<void> {
  const exists = await ProduitsRepo.getOne(id);
  if (!exists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, PRODUIT_NON_TROUVE);
  }
  return ProduitsRepo.delete(id);
}

/**
 * Retourner des produits avec filtres
 * @param filtres Les filtres à appliquer (n'importe quoi)
 * @return Une Promise qui, une fois résolue, renvoie un tableau d'objets IProduit[] 
 * Sinon un tableau vide est retourné.
 */
// 
function getWithFiltres(filtres: Record<string, any>): Promise<IProduit[]> {
  return ProduitsRepo.getWithFiltres(filtres);
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getAll,
  getOne,
  addOne,
  updateOne,
  delete: _delete,
  getWithFiltres,
} as const;
