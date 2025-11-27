/** 
 * Ce code est inspiré du cours de Web 3 de @author Etienne Rivard
 * adapté Michel Komivi Akakpo
 */

import { isString } from 'jet-validators';
import { parseObject, TParseOnError } from 'jet-validators/utils';

/******************************************************************************
                                  Types
******************************************************************************/

// Ce type sert seulement pour le login (courriel + mot_de_passe)
export interface IUserLogin {
  courriel: string;
  mot_de_passe: string;
}

/******************************************************************************
                                  Setup
******************************************************************************/

// On prépare un validateur simple pour IUserLogin
const parseUserLogin = parseObject<IUserLogin>({
  courriel: isString,
  mot_de_passe: isString,
});

/******************************************************************************
                                 Functions
******************************************************************************/

/**
 * Vérifie que l'objet reçu correspond bien à IUserLogin.
 * Utilisé par parseReq dans JetonRoutes.
 */
function testlogin(arg: unknown, errCb?: TParseOnError): arg is IUserLogin {
  return !!parseUserLogin(arg, errCb);
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  testlogin,
} as const;
