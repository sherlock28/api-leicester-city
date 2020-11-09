/*Aqui se definen todos las rutas '/api/matches'*/

import { Router } from 'express';
import { matchesController } from '../controllers';

/*Middleware que verifica la validez del token*/
import { TokenValidation } from '../middlewares/verify.auth';

/*Middleware que verifica la validez y formato de las fechas ingresadas*/
import { ValidationDates } from '../middlewares/matches/verify.dates';

/*Middleware que verifica la validez datos ingresados 
para registrar un partido*/
import { ValidateFieldMatch } from '../middlewares/matches/verify.match';

const router = Router();

router.get('/last', TokenValidation, matchesController.getLastMatch);

router.get('/match/:id', TokenValidation, matchesController.getMatch);

router.get('/start/:startdate/end/:enddate', TokenValidation, ValidationDates, matchesController.getMatchesBetweenDates);

router.get('/points/start/:startdate/end/:enddate', TokenValidation, ValidationDates, matchesController.getPointsBetweenDates);

router.get('/mostgoals',TokenValidation, matchesController.getTeamMostGoals);

router.post('/new', TokenValidation, ValidateFieldMatch, matchesController.addMatch);

export default router;