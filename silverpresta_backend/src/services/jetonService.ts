/** 
 * Ce code est tiré du site de cours
 * adapté par Michel Komivi Akakpo
 */

//src/services/jetonService.ts
// **** Variables **** //

import { IUserLogin } from '@src/models/user';
import UserService from './utilisateursService';
import jwt from 'jsonwebtoken';
import ENV from '@src/common/constants/ENV';

export const UTILISATEUR_NOT_FOUND_ERR = 'Utilisateur non trouvé';

// **** Functions **** //

/**
 * Générer un jeton pour un utilisateur
 *
 * @param {IUserLogin} utilisateur - L'utilisateur demandant le jeton
 * @returns {Promise} - Le jeton signé
 */
async function generateToken(utilisateur: IUserLogin): Promise<string> {
  const utilisateurBD = (await UserService.getAll()).filter(
    (user) => user.courriel === utilisateur.courriel,
  )[0];
  if (utilisateurBD && utilisateurBD.mot_de_passe === utilisateur.mot_de_passe) {
    return jwt.sign(utilisateur.courriel, ENV.Jwtsecret as string);
  } else {
    return '';
  }
}

// **** Export default **** //
export default {
  generateToken,
} as const;