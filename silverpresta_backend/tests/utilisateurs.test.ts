/**
 * Tests unitaires de l’API Utilisateurs
 */

import insertUrlParams from 'inserturlparams';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { UTILISATEUR_NON_TROUVE } from '@src/services/utilisateursService';
import Paths from './common/Paths';
import { TRes } from './common/util';
import { agent } from './support/setup';
import { IUtilisateur, Utilisateur } from '@src/models/utilisateurs';
import jwt from 'jsonwebtoken';
import ENV from '../src/common/constants/ENV';
import { Test } from 'supertest';


// eslint-disable-next-line
const mockify = require('@jazim/mock-mongoose');

/******************************************************************************
 * Données bidon pour les utilisateurs (simulacre de GET)
 *****************************************************************************/

const DB_UTILISATEURS: IUtilisateur[] = [
  {
    id: 'u1',
    nom: 'Akakpodji',
    prenom: 'Komivil Michel',
    courriel: 'komivil.akakpodji@silverpresta.com',
    mot_de_passe: 'Azerty@123',
    role: 'admin',
    actif: true,
    date_creation: new Date('2024-10-01T10:00:00.000Z'),
  },
  {
    id: 'u2',
    nom: 'Sambasso',
    prenom: 'Pappe',
    courriel: 'pappe.sambasso@silverpresta.com',
    mot_de_passe: 'Pape@2024',
    role: 'employe',
    actif: true,
    date_creation: new Date('2024-10-01T10:30:00.000Z'),
  },
  {
    id: 'u3',
    nom: 'Desrochers',
    prenom: 'Myriame',
    courriel: 'myriame.desrochers@silverpresta.com',
    mot_de_passe: 'Myriam@2024',
    role: 'gestionnaire',
    actif: true,
    date_creation: new Date('2024-10-01T11:00:00.000Z'),
  },
] as const;

/******************************************************************************
 * Jeton JWT pour les tests (toutes les routes sont protégées)
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
 * Tests pour utilisateursRouter
 *****************************************************************************/

describe('utilisateursRouter', () => {
  /******************* GET /api/utilisateurs/all ********************/
  describe(`'GET:${Paths.Utilisateur.GetAll}'`, () => {
    // Succès
    it(
      'doit retourner un JSON avec tous les utilisateurs et un code de ' +
        `'${HttpStatusCodes.OK}' si réussi.`,
      async () => {
        const data = [...DB_UTILISATEURS];
        // eslint-disable-next-line
        mockify(Utilisateur).toReturn(data, 'find');

        const res: TRes<{ utilisateurs: IUtilisateur[] }> = await avecAuth(
          agent.get(Paths.Utilisateur.GetAll),
        );

        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body.utilisateurs.length).toBe(DB_UTILISATEURS.length);
        expect(res.body.utilisateurs[0].courriel).toBe(
          DB_UTILISATEURS[0].courriel,
        );
      },
    );
  });

  /******************* GET /api/utilisateurs/:id ********************/
  describe(`'GET:${Paths.Utilisateur.GetOne}'`, () => {
    const getPath = (id: string) =>
      insertUrlParams(Paths.Utilisateur.GetOne, { id });

    // Succès : l'utilisateur existe
    it(
      'doit retourner un utilisateur et un code \'200\' si l\'id existe.',
      async () => {
        // eslint-disable-next-line
        mockify(Utilisateur).toReturn(DB_UTILISATEURS[0], 'findOne');

        const res: TRes<{ utilisateur: IUtilisateur }> = await avecAuth(
          agent.get(getPath(DB_UTILISATEURS[0].id)),
        );

        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body.utilisateur.nom).toBe(DB_UTILISATEURS[0].nom);
        expect(res.body.utilisateur.courriel).toBe(DB_UTILISATEURS[0].courriel,
        );
      },
    );

    // Utilisateur non trouvé
    it(
      'doit retourner un code \'404\' et un message si l\'id n\'existe pas.',
      async () => {
        // eslint-disable-next-line
        mockify(Utilisateur).toReturn(null, 'findOne');

        const res: TRes = await avecAuth(agent.get(getPath('-1')));

        expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
        expect(res.body.error).toBe('Utilisateur non trouvé');
      },
    );
  });

  /******************* POST /api/utilisateurs/add ********************/
  describe(`'POST:${Paths.Utilisateur.Add}'`, () => {
    // Ajout réussi
    it(
      `doit retourner le code '${HttpStatusCodes.CREATED}' si la ` +
        'transaction est réussie',
      async () => {
        const utilisateur: IUtilisateur = {
          id: 'u10',
          nom: 'Ground',
          prenom: 'Milesim',
          courriel: 'milesim.ground@silverpresta.com',
          mot_de_passe: 'Milesim@2024',
          role: 'employe',
          actif: true,
          date_creation: new Date(),
        };

        // eslint-disable-next-line
        mockify(Utilisateur).toReturn(utilisateur, 'save');

        const res: TRes = await avecAuth(
          agent.post(Paths.Utilisateur.Add).send({ utilisateur }),
        );

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
          agent.post(Paths.Utilisateur.Add).send({ utilisateur: null }),
        );

        expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(res.body.error).toBe('Utilisateur requis');
      },
    );
  });

  /******************* PUT /api/utilisateurs/update ********************/
  describe(`'PUT:${Paths.Utilisateur.Update}'`, () => {
    // Succès
    it(
      `doit retourner un code de '${HttpStatusCodes.OK}' si la mise à jour ` +
        'est réussie.',
      async () => {
        const utilisateur = { ...DB_UTILISATEURS[0], nom: 'Akakpo Mis à jour' };
        // eslint-disable-next-line
        mockify(Utilisateur).toReturn(DB_UTILISATEURS[0], 'findOne').toReturn(utilisateur, 'save');

        const res: TRes = await avecAuth(
          agent.put(Paths.Utilisateur.Update).send({ utilisateur }),
        );

        expect(res.status).toBe(HttpStatusCodes.OK);
      },
    );

    // Utilisateur non trouvé
    it(
      'doit retourner un JSON avec erreur  ' +
        `'${UTILISATEUR_NON_TROUVE}' et un code de ` +
        `'${HttpStatusCodes.NOT_FOUND}' si l'id n'est pas trouvé.`,
      async () => {
        // eslint-disable-next-line
        mockify(Utilisateur).toReturn(null, 'findOne');

        const utilisateur: IUtilisateur = {
          id: 'u99',
          nom: 'Souka',
          prenom: 'Edem',
          courriel: 'edem.souka@silverpresta.com',
          mot_de_passe: 'Azerty@123',
          role: 'employe',
          actif: true,
          date_creation: new Date(),
        };

        const res: TRes = await avecAuth(
          agent.put(Paths.Utilisateur.Update).send({ utilisateur }),
        );

        expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
        expect(res.body.error).toBe(UTILISATEUR_NON_TROUVE);
      },
    );
  });

  /******************* DELETE /api/utilisateurs/delete/:id ********************/
  describe(`'DELETE:${Paths.Utilisateur.Delete}'`, () => {
    const getPath = (id: string) =>
      insertUrlParams(Paths.Utilisateur.Delete, { id });

    // Succès
    it(
      `doit retourner un code de '${HttpStatusCodes.OK}' si la ` +
        'suppression est réussie.',
      async () => {
        // eslint-disable-next-line
        mockify(Utilisateur).toReturn(DB_UTILISATEURS[0], 'findOne').toReturn({}, 'findAndRemove');

        const id = DB_UTILISATEURS[0].id;

        const res: TRes = await avecAuth(agent.delete(getPath(id)));

        expect(res.status).toBe(HttpStatusCodes.OK);
      },
    );

    // Utilisateur non trouvé
    it(
      'doit retourner un JSON avec erreur ' +
        `'${UTILISATEUR_NON_TROUVE}' et un code de  ` +
        `'${HttpStatusCodes.NOT_FOUND}' si l'utilisateur est introuvable.`,
      async () => {
        // eslint-disable-next-line
        mockify(Utilisateur).toReturn(null, 'findOne');

        const res: TRes = await avecAuth(agent.delete(getPath('u45')));

        expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
        expect(res.body.error).toBe(UTILISATEUR_NON_TROUVE);
      },
    );
  });
});
