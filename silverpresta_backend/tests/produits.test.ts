/**
 * Tests unitaires de l’API Produits
 * 
 * inspiré du cours Web3 de @author Étienne Rivard
 * l'éléve Komivi Akakpo a adapté le code portant sur les auteurs pour les produits de son projet
 */

import insertUrlParams from 'inserturlparams';
import { customDeepCompare } from 'jet-validators/utils';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { PRODUIT_NON_TROUVE } from '@src/services/produitsService';
import Paths from './common/Paths';
import { TRes } from './common/util';
import { agent } from './support/setup';
import { IProduit, Produit } from '@src/models/produits';
import jwt from 'jsonwebtoken';
import ENV from '@src/common/constants/ENV';
import { Test } from 'supertest';

// eslint-disable-next-line
const mockify = require('@jazim/mock-mongoose');

/******************************************************************************
 * Données bidon pour les produits (simulacre de GET)
 *****************************************************************************/

const DB_PRODUITS: IProduit[] = [
  {
    id: '1',
    nom: 'T-shirt coton bio',
    code: 'TSH001',
    categorie: 'Vêtements',
    description: 'T-shirt 100% coton biologique',
    quantite: 50,
    seuilReapprovisionnement: 10,
    prixVente: 24.99,
    prixAchat: 12.5,
    fournisseur: 'Textile Éco',
    // Pour les tests, on met des string en any pour ObjectId
    ajoutePar: '671bb0f5c2d4e0f91a1a01a2',
    misAJourPar: '671bb0f5c2d4e0f91a1a01a2',
    urlImage: '',
    actif: true,
    tags: ['nouveauté'],
    dateAjout: new Date('2025-05-01'),
    dateMiseAJour: new Date('2025-05-01'),
  },
  {
    id: '2',
    nom: 'Chaussures AirFlex',
    code: 'CHA001',
    categorie: 'Chaussures',
    description: 'Chaussures de sport légères',
    quantite: 20,
    seuilReapprovisionnement: 5,
    prixVente: 79.99,
    prixAchat: 50,
    fournisseur: 'SportLine',
    ajoutePar: '671bb0f5c2d4e0f91a1a01a2',
    misAJourPar: '671bb0f5c2d4e0f91a1a01a2',
    urlImage: '',
    actif: true,
    tags: ['écoresponsable'],
    dateAjout: new Date(),
    dateMiseAJour: new Date(),
  },
  {
    id: '3',
    nom: 'Montre Connectée X200',
    code: 'MNT001',
    categorie: 'Accessoires',
    description: 'Montre intelligente avec suivi de la santé',
    quantite: 15,
    seuilReapprovisionnement: 3,
    prixVente: 199.99,
    prixAchat: 120,
    fournisseur: 'TechGear',
    ajoutePar: '91bb0f5c2d4e0f91a1a01a',
    misAJourPar: '91bb0f5c2d4e0f91a1a01a',
    urlImage: '',
    actif: true,
    tags: ['bestseller', 'nouveauté'],
    dateAjout: new Date(),
    dateMiseAJour: new Date(),
  },
] as const;

/******************************************************************************
 * Fonction de comparaison (comme ton prof)
 *****************************************************************************/

// On ne compare que certains champs, pas les dates, pas les id, etc.
const compareProduits = customDeepCompare({
  onlyCompareProps: [
    'nom',
    'code',
    'categorie',
    'description',
    'quantite',
    'prixVente',
    'actif',
  ],
});

/******************************************************************************
 * Jeton JWT pour les tests (toutes tes routes sont protégées)
 *****************************************************************************/

// On génère un jeton de test valide avec la même clé secrète que le serveur
const TEST_TOKEN : string = jwt.sign(
  {
    courriel: 'komivi.akakpo@silverpresta.com',
    role: 'admin',
  },
  ENV.Jwtsecret as string,
  { expiresIn: '1200h' },
);

// Petite fonction utilitaire pour ajouter le header Authorization
function avecAuth(req: Test ) {
  return req.set('Authorization', `Bearer ${TEST_TOKEN}`);
}

/******************************************************************************
 * Tests (adaptés de l'exemple Auteur)
 *****************************************************************************/

describe('produitsRouter', () => {
  /******************* GET /api/produits/all ********************/
  describe(`'GET:${Paths.Produit.GetAll}'`, () => {
    // Succès
    it(
      'doit retourner un JSON avec tous les produits et un code de ' +
        `'${HttpStatusCodes.OK}' si réussi.`,
      async () => {
        // Préparer le simulacre de Mongoose
        const data = [...DB_PRODUITS];
        // eslint-disable-next-line
        mockify(Produit).toReturn(data, 'find');

        const res: TRes<{ produits: IProduit[] }> = await avecAuth(
          agent.get(Paths.Produit.GetAll),
        );

        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(compareProduits(res.body.produits, DB_PRODUITS)).toBeTruthy();
      },
    );
  });

  /******************* GET /api/produits/:id (getOne) ********************/
  describe(`'GET:${Paths.Produit.GetOne}'`, () => {
    // Construit l’URL /api/produits/:id
    const getPath = (id: string) =>
      insertUrlParams(Paths.Produit.GetOne, { id });

    // Succès
    it(
      'doit retourner un produit et un code \'200\' si l\'id existe.',
      async () => {
        // eslint-disable-next-line
        mockify(Produit).toReturn(DB_PRODUITS[0], 'findOne');

        const res: TRes<{ produit: IProduit }> = await avecAuth(
          agent.get(getPath(DB_PRODUITS[0].id)),
        );

        expect(res.status).toBe(HttpStatusCodes.OK);
        // On vérifie que c’est bien le bon produit
        expect(res.body.produit.nom).toBe(DB_PRODUITS[0].nom);
        expect(res.body.produit.code).toBe(DB_PRODUITS[0].code);
      },
    );

    // Produit non trouvé
    it(
      'doit retourner \'null\' pour le produit et un code \'200\' si l\'id n\'existe pas.',
      async () => {
        // eslint-disable-next-line
        mockify(Produit).toReturn(null, 'findOne');

        const res: TRes<{ produit: IProduit | null }> = await avecAuth(
          agent.get(getPath('999')), // id qui n'existe pas
        );

        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body.produit).toBeNull();
      },
    );
  });

  /******************* POST /api/produits/add ********************/
  describe(`'POST:${Paths.Produit.Add}'`, () => {
    // Ajout réussi
    it(
      `doit retourner le code '${HttpStatusCodes.CREATED}' si la ` +
        'transaction est réussie',
      async () => {
        const produit : IProduit = {
          id: '12',
          nom: 'PC Gaming Pro',
          code: 'PCG001',
          categorie: 'Matériel Informatique',
          description: 'PC de bureau haut de gamme pour les jeux vidéo',
          quantite: 15,
          seuilReapprovisionnement: 10,
          prixVente: 1200,
          prixAchat: 1000,
          fournisseur: 'TechGear',
          ajoutePar: '111bb0f5c2d4e0f91a1a01a2',
          misAJourPar: '111bb0f5c2d4e0f91a1a01a2',
          urlImage: '',
          actif: true,
          tags: ['bestseller', 'nouveauté'],
          dateAjout: new Date(),
          dateMiseAJour: new Date(),
        };

        // eslint-disable-next-line
        mockify(Produit).toReturn(produit, 'save');
        const res = await avecAuth(agent.post(Paths.Produit.Add).send({ produit }));
        expect(res.status).toBe(HttpStatusCodes.CREATED);
      },
    );

    // Paramètre manquant
    it(
      'doit retourner un JSON avec les erreurs et un code de ' +
        `'${HttpStatusCodes.BAD_REQUEST}' si un paramètre est ` +
        'manquant.',
      async () => {
        const res: TRes = await avecAuth(
          agent.post(Paths.Produit.Add).send({ produit: null }),
        );

        expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(res.body.error).toBe('Produit requis');
      },
    );
  });

  /******************* GET /api/produits/filtres ********************/
  describe(`'GET:${Paths.Produit.GetWithFiltres}'`, () => {
    it(
      'doit retourner les produits filtrés et un code \'200\' si la requête est valide.',
      async () => {
        // On veut par exemple les produits actifs dans la catégorie "Chaussures"
        const produitsFiltres = [DB_PRODUITS[1]]; // "Chaussures AirFlex"

        // eslint-disable-next-line
        mockify(Produit).toReturn(produitsFiltres, 'find');

        const res: TRes<{ produits: IProduit[] }> = await avecAuth(
          agent
            .get(Paths.Produit.GetWithFiltres)
            .query({ categorie: 'Chaussures', actif: 'true' }),
        );

        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body.produits.length).toBe(1);
        expect(res.body.produits[0].categorie).toBe('Chaussures');
        expect(res.body.produits[0].actif).toBe(true);
      },
    );
  });


  /******************* PUT /api/produits/update ********************/
  describe(`'PUT:${Paths.Produit.Update}'`, () => {
    // Succès
    it(
      `doit retourner un code de '${HttpStatusCodes.OK}' si la mise à jour ` +
        'est réussie.',
      async () => {
        // On part d'un produit existant
        const produit = DB_PRODUITS[0];
        produit.nom = 'T-shirt coton bio';

        // eslint-disable-next-line
        mockify(Produit).toReturn(DB_PRODUITS[0], 'findOne').toReturn(produit, 'save');

        const res: TRes = await avecAuth(
          agent.put(Paths.Produit.Update).send({ produit }),
        );
        expect(res.status).toBe(HttpStatusCodes.OK);
      },
    );

    // Produit non trouvé
    it(
      'doit retourner un JSON avec erreur  ' +
        `'${PRODUIT_NON_TROUVE}' et un code de ` +
        `'${HttpStatusCodes.NOT_FOUND}' si l'id n'est pas trouvé.`,
      async () => {
      // eslint-disable-next-line
        mockify(Produit).toReturn(null, 'findOne');

        const produit = {
          id: '5',
          nom: 'PC Gaming Pro',
          code: 'PCG001',
          categorie: 'Matériel Informatique',
          description: 'PC de bureau haut de gamme pour les jeux vidéo',
          quantite: 15,
          seuilReapprovisionnement: 12,
          prixVente: 1200,
          prixAchat: 1000,
          fournisseur: 'TechGear',
          ajoutePar: '91bb0f5c2d4e0f91a1a01a',
          misAJourPar: '91bb0f5c2d4e0f91a1a01a',
          urlImage: '',
          actif: true,
          tags: ['bestseller', 'nouveauté'],
          dateAjout: new Date(),
          dateMiseAJour: new Date(),
        };

        const res: TRes = await avecAuth(
          agent.put(Paths.Produit.Update).send({ produit }),
        );

        expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
        expect(res.body.error).toBe(PRODUIT_NON_TROUVE);
      },
    );
  });

  /******************* DELETE /api/produits/delete/:id ********************/
  describe(`'DELETE:${Paths.Produit.Delete}'`, () => {
    const getPath = (id: string) =>
      insertUrlParams(Paths.Produit.Delete, { id });

    // Succès
    it(
      `doit retourner un code de '${HttpStatusCodes.OK}' si la ` +
        'suppression est réussie.',
      async () => {
        // eslint-disable-next-line
        mockify(Produit).toReturn(DB_PRODUITS[0], 'findOne').toReturn({}, 'findAndRemove');
        const id = DB_PRODUITS[0].id,
          res = await avecAuth(agent.delete(getPath(id)));
        expect(res.status).toBe(HttpStatusCodes.OK);
      },
    );

    // Produit non trouvé
    it(
      'doit retourner un JSON avec erreur ' +
        `'${PRODUIT_NON_TROUVE}' et un code de  ` +
        `'${HttpStatusCodes.NOT_FOUND}' si le produit est introuvable.`,
      async () => {
        // eslint-disable-next-line
        mockify(Produit).toReturn(null, 'findOne');

        const res: TRes = await avecAuth(agent.delete(getPath('999')));

        expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
        expect(res.body.error).toBe(PRODUIT_NON_TROUVE);
      },
    );
  });
});