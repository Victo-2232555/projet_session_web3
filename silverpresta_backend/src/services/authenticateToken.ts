/** 
 * Ce code est tire du site du cours Web 3 @author Etienne Rivard
 * adapté par Michel Komivi Akakpo
 */
// src/services/authenticateToken.ts
import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import ENV from '@src/common/constants/ENV';

/**
 * Intergiciel pour authentifier le jeton de l'utilisateur
 *
 * @param {Request} req - La requête au serveur
 * @param {Response} res - La réponse du serveur
 * @param {NextFunction} next - La fonction a appeler pour continuer le processus.
 */

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  // Ne pas vérifier le token si l'url est celui de generatetoken
  if (req.path.startsWith('/api/generatetoken')) {
    return next();
  }

  // Protéger uniquement les routes API
  if (!req.path.startsWith('/api')) {
    return next();
  }
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  console.log(token);

  if (token == null) return res.sendStatus(HttpStatusCodes.UNAUTHORIZED);

  jwt.verify(token, ENV.Jwtsecret as string, (err: any, user: any) => {
    console.log(err);

    if (err) return res.sendStatus(HttpStatusCodes.FORBIDDEN);

    next();
  });
}

export default authenticateToken;
