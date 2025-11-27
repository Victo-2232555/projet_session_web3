import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import UtilisateursService from '@src/services/utilisateursService';
import { IUtilisateur } from '@src/models/utilisateurs';
import { IReq, IRes } from './common/types';

/******************************************************************************
                                Fonctions
******************************************************************************/

/**
 * Récupérer tous les utilisateurs
 */
async function getAll(_: IReq, res: IRes) {
  const utilisateurs = await UtilisateursService.getAll();
  res.status(HttpStatusCodes.OK).json({ utilisateurs });
}

/**
 * Récupérer un utilisateur par ID
 */
async function getOne(req: IReq, res: IRes) {
  const { id } = req.params;
  const utilisateur = await UtilisateursService.getOne(id as string);
  if (!utilisateur) {
    return res
      .status(HttpStatusCodes.NOT_FOUND)
      .json({ error: 'Utilisateur non trouvé' });
  }
  res.status(HttpStatusCodes.OK).json({ utilisateur });
}

/**
 * Ajouter un utilisateur
 */
async function add(req: IReq, res: IRes) {
  const { utilisateur } = req.body;
  await UtilisateursService.addOne(utilisateur as IUtilisateur);
  res.status(HttpStatusCodes.CREATED).end();
}



/**
 * Mettre à jour un utilisateur
 */
async function update(req: IReq, res: IRes) {
  const { utilisateur } = req.body;
  await UtilisateursService.updateOne(utilisateur as IUtilisateur);
  res.status(HttpStatusCodes.OK).end();
}

/**
 * Supprimer un utilisateur
 */
async function delete_(req: IReq, res: IRes) {
  const { id } = req.params;
  await UtilisateursService.delete(id as string);
  res.status(HttpStatusCodes.OK).end();
}

/******************************************************************************
                                Export par défaut
******************************************************************************/

export default {
  getAll,
  getOne,
  add,
  update,
  delete: delete_,
} as const;
