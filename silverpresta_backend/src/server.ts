
import cors from 'cors';//pour autoriser les requetes venant du frontend
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';

import BaseRouter from '@src/routes';

import Paths from '@src/common/constants/Paths';
import ENV from '@src/common/constants/ENV';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { RouteError } from '@src/common/util/route-errors';
import { NodeEnvs } from '@src/common/constants';

import authenticateToken from './services/authenticateToken';

const app = express();

/******************************************************************************
                        CORS Configuration
******************************************************************************/
app.use(
  cors({
    origin: 'http://localhost:5173', // frontend Vite
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

/******************************************************************************
                                Setup
*******************************************************************************/

// **** Middleware **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Show routes called in console during development
if (ENV.NodeEnv === NodeEnvs.Dev) {
  app.use(morgan('dev'));
}

// Securité avec helmet
if (ENV.NodeEnv === NodeEnvs.Production) {
  // eslint-disable-next-line n/no-process-env
  if (!process.env.DISABLE_HELMET) {
    app.use(helmet());
  }
}

/******************************************************************************
                        Documentation HTML
******************************************************************************/

/// Pour la documentation HTML 
app.get('/api', (req: Request, res: Response) => {
  return res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

/******************************************************************************
                        Authentification des jetons
 *****************************************************************************/
//protections de toutes les routes api avec les jetons
// si tu mets les routes avant cette ligne, elles ne seront pas protégées
// j'ai compris par la suite

app.use(authenticateToken);

/******************************************************************************
                        Routes API (JSON)
******************************************************************************/

// Toutes les routes de l'API commencent par /api
app.use(Paths.Base, BaseRouter);

/******************************************************************************
                        Gestion des erreurs
******************************************************************************/

// Add error handler
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (ENV.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.err(err, true);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
    res.status(status).json({ error: err.message });
  }
  return next(err);
});

/******************************************************************************
                                Export default
******************************************************************************/

export default app;
