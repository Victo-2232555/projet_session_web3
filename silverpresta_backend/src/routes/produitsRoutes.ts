import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import ProduitsService from '@src/services/produitsService';
import { IProduit } from '@src/models/produits';
import { IReq, IRes } from './common/types';

/******************************************************************************
                                Functions
******************************************************************************/
/**
 * Extraire tous les produits
 */
async function getAll(_: IReq, res: IRes) {
  const produits = await ProduitsService.getAll();
  res.status(HttpStatusCodes.OK).json({ produits });
}


/**
 * Extraire un produit par ID
 */
async function getOne(req: IReq, res: IRes) {
  const { id } = req.params;
  const produit = await ProduitsService.getOne(id as string);
  res.status(HttpStatusCodes.OK).json({ produit } );
}


/**
 * Ajouter un produit
 */
async function add(req: IReq, res: IRes) {
  const { produit } = req.body;
  await ProduitsService.addOne(produit as IProduit);
  res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Mettre à jour un produit
 */
async function update(req: IReq, res: IRes) {
  const { produit } = req.body;
  await ProduitsService.updateOne(produit as IProduit);
  res.status(HttpStatusCodes.OK).end();
}

/**
 * Supprimer un produit
 */
async function delete_(req: IReq, res: IRes) {
  const { id } = req.params;
  await ProduitsService.delete(id as string);
  res.status(HttpStatusCodes.OK).end();
}

/**
 * Extraire des produits avec filtres
 * Dans notre exemple, on peut filtrer par catégorie, actif et quantité minimum
 * /api/produits/filtres?categorie=Vêtements&actif=true&quantite=10
 * source: https://mongoosejs.com/docs/queries.html
 * source: https://www.mongodb.com/docs/manual/reference/operator/query/gte/
 * source: https://www.slingacademy.com/article/mongoose-how-to-filter-documents-by-multiple-fields/
 */
async function getWithFiltres(req: IReq, res: IRes) {
  // On récupère les filtres dans l’URL
  const { categorie, actif, quantite } = req.query;

  // On crée un objet filtres vide car on ne connait pas le ou les paramètres que l'utilisateur va fournir dans l'URL
  const filtres: Record<string, any> = {};

  // Si on a categorie=Vêtements
  if (categorie) {
    filtres.categorie = categorie;
  }

  // Si on a actif=true ou false
  if (actif !== undefined) {
    filtres.actif = actif === 'true';
  }

  // Si on veut filtrer par quantité minimum
  if (quantite) {
    filtres.quantite = { $gte: Number(quantite) };
  }

  // On envoie les filtres au service
  const produits = await ProduitsService.getWithFiltres(filtres);

  // On renvoie la réponse
  res.status(200).json({ produits });
}


/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getAll,
  getOne,
  add,
  update,
  delete: delete_,
  getWithFiltres,
} as const;
