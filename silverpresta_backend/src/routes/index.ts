/** 
 * Ce code est tire du site du cours Web 3 @author Etienne Rivard
 * adapté par Michel Komivi Akakpo
 */

//src/routes/index.ts
import { Request, Response, NextFunction, Router } from 'express';

import Paths from '@src/common/constants/Paths';
import ProduitsRoutes from './produitsRoutes';
import UtilisateursRoutes from './utilisateursRoutes';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { Produit } from '@src/models/produits';
import { Utilisateur } from '@src/models/utilisateurs';
/**
 * importation concernant les routes des jetons
 */
import JetonRoutes from './jetonsRoutes';


/******************************************************************************
                                Setup 
******************************************************************************/

const apiRouter = Router();

/******************************************************************************
                            Validation Produits
******************************************************************************/

function validateProduit(req: Request, res: Response, next: NextFunction) {
  if (req.body === null ) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .send({ error: 'Produit requis' })
      .end();
  }

  if (req.body.produit === null ) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .send({ error: 'Produit requis' })
      .end();
  }

  const nouveauProduit = new Produit(req.body.produit);
  const error = nouveauProduit.validateSync();
  if (error) {
    res.status(HttpStatusCodes.BAD_REQUEST).send(error).end();
  } else {
    next();
  }
}

/******************************************************************************
                            Validation Utilisateurs
******************************************************************************/

function validateUtilisateur(req: Request, res: Response, next: NextFunction) {
  if (req.body === null ) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .send({ error: 'Utilisateur requis' })
      .end();
  }
  if (req.body.utilisateur === null ) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .send({ error: 'Utilisateur requis' })
      .end();
  }

  const nouvelUtilisateur = new Utilisateur(req.body.utilisateur);
  const error = nouvelUtilisateur.validateSync();
  if (error) {
    res
    .status(HttpStatusCodes.BAD_REQUEST)
    .send(error)
    .end();
  } else {
    next();
  }
}

/******************************************************************************
                  Router pour les jetons (authentification)
******************************************************************************/

const tokenRouter = Router();

// Générer un jeton (login)
tokenRouter.post(Paths.GenerateToken.Get, JetonRoutes.generateToken);


// Ajouter le tokenRouter sur /api/generatetoken
apiRouter.use(Paths.GenerateToken.Base, tokenRouter);

/******************************************************************************
                      Routes Produits
******************************************************************************/

const produitsRouter = Router();

produitsRouter.get(Paths.Produit.GetWithFiltres, ProduitsRoutes.getWithFiltres);
produitsRouter.get(Paths.Produit.GetAll, ProduitsRoutes.getAll);
produitsRouter.get(Paths.Produit.GetOne, ProduitsRoutes.getOne);
produitsRouter.post(Paths.Produit.Add, validateProduit, ProduitsRoutes.add);
produitsRouter.put(Paths.Produit.Update, ProduitsRoutes.update);
produitsRouter.delete(Paths.Produit.Delete, ProduitsRoutes.delete);

apiRouter.use(Paths.Produit.Base, produitsRouter);

/******************************************************************************
                            Routes Utilisateurs
****************************************************************************`^**/

const utilisateursRouter = Router();

utilisateursRouter.get(Paths.Utilisateur.GetAll, UtilisateursRoutes.getAll);
utilisateursRouter.get(Paths.Utilisateur.GetOne, UtilisateursRoutes.getOne);
utilisateursRouter.post(Paths.Utilisateur.Add, validateUtilisateur, UtilisateursRoutes.add);
utilisateursRouter.put(Paths.Utilisateur.Update, UtilisateursRoutes.update);
utilisateursRouter.delete(Paths.Utilisateur.Delete, UtilisateursRoutes.delete);

apiRouter.use(Paths.Utilisateur.Base, utilisateursRouter);

/******************************************************************************
                                Export default
******************************************************************************/

export default apiRouter;
