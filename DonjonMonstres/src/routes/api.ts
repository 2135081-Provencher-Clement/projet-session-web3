import { NextFunction, Request, Response, Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from '../constants/Paths';
import ElementRoutes from './ElementRoutes';
import RaceRoutes from './RaceRoutes';
import MonstreRoutes from './MonstreRoutes';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { ID_INVALIDE_ERROR } from '@src/constants/Erreurs';
import Race from '@src/models/Race';
import Element from '@src/models/Element';
import Monstre from '@src/models/Monstre';


const apiRouter = Router();

const elementRouter = Router();
const raceRouter = Router();
const monstreRouter = Router();

//Validateurs

/**
 * Valide si l'object id est valide
 */
// Fonction fortement inspirée de ce que j'ai trouvé dans cette solution -> https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid
function ValiderObjectId(requete: Request, result: Response, next: NextFunction) {

	var ObjectId = require("mongoose").Types.ObjectId;
	var isValid = false;
	var possibleObjectId = requete.params.id;

	if (ObjectId.isValid(possibleObjectId)) 
	{     
		if (String(new ObjectId(possibleObjectId)) === possibleObjectId) 
		{        
			isValid = true      
		}  
	} 

	if(!isValid) {
		result.status(HttpStatusCodes.BAD_REQUEST).send({erreur : ID_INVALIDE_ERROR}).end();
	} else {
		next();
	}
}

/**
 * Valide l'élément
 */
function ValiderElement(requete: Request, result: Response, next: NextFunction)
{
	const element = new Element(requete.body.element);
	const error = element.validateSync();
	if (error !== null && error !== undefined) {
		result.status(HttpStatusCodes.BAD_REQUEST).send({erreur : error}).end();
	} else {
		next();
	}
}

/**
 * Valide la race
 */
async function ValiderRace(requete: Request, result: Response, next: NextFunction)
{
	var erreur : any
	try {
		const race = new Race(requete.body.race);
		erreur = await race.validate();
	} catch (e) {
		result.status(HttpStatusCodes.BAD_REQUEST).send({erreur : e}).end();
		return;
	}

	if (erreur !== null && erreur !== undefined) {
		result.status(HttpStatusCodes.BAD_REQUEST).send({erreur : erreur}).end();
	} else {
		next();
	}
}

/**
 * Valide le monstre
 */
function ValiderMonstre(requete: Request, result: Response, next: NextFunction)
{
	const monstre = new Monstre(requete.body.monstre);
	const error = monstre.validateSync();
	if (error !== null && error !== undefined) {
		result.status(HttpStatusCodes.BAD_REQUEST).send({erreur : error}).end();
	} else {
		next();
	}
}

// Éléments

elementRouter.get(
	Paths.Element.GetAll,
	ElementRoutes.getAll
);

elementRouter.get(
	Paths.Element.GetIdParNom,
	ElementRoutes.getIdParNom
);

elementRouter.get(
	Paths.Element.GetNomParId,
	ValiderObjectId,
	ElementRoutes.getNomParId
);

elementRouter.post(
	Paths.Element.Insert,
	ValiderElement,
	ElementRoutes.insert
);

elementRouter.put(
	Paths.Element.Update,
	ValiderElement,
	ElementRoutes.update
)

elementRouter.delete(
	Paths.Element.Delete,
	ValiderObjectId,
	ElementRoutes.delete
)


// Races

raceRouter.get(
	Paths.Race.GetAll,
	RaceRoutes.getAll
);

raceRouter.get(
	Paths.Race.GetById,
	ValiderObjectId,
	RaceRoutes.getById
);

raceRouter.get(
	Paths.Race.GetIdParNom,
	RaceRoutes.getIdParNom
);

raceRouter.post(
	Paths.Race.Insert,
	ValiderRace,
	RaceRoutes.insert
);

raceRouter.put(
	Paths.Race.Update,
	ValiderRace,
	RaceRoutes.update
);

raceRouter.delete(
	Paths.Race.Delete,
	ValiderObjectId,
	RaceRoutes.delete
);


// Monstres

monstreRouter.get(
	Paths.Monstre.GetAll,
	MonstreRoutes.getAll
);

monstreRouter.get(
	Paths.Monstre.GetById,
	ValiderObjectId,
	MonstreRoutes.getById
);

monstreRouter.get(
	Paths.Monstre.Mortel,
	MonstreRoutes.getMonstreLePlusMortel
)

monstreRouter.get(
	Paths.Monstre.Amical,
	MonstreRoutes.getMonstreLePlusAmical
)

monstreRouter.post(
	Paths.Monstre.Insert,
	ValiderMonstre,
	MonstreRoutes.insert
);

monstreRouter.put(
	Paths.Monstre.Update,
	ValiderMonstre,
	MonstreRoutes.update
);

monstreRouter.delete(
	Paths.Monstre.Delete,
	ValiderObjectId,
	MonstreRoutes.delete
);



apiRouter.use(Paths.Element.Base, elementRouter);

apiRouter.use(Paths.Race.Base, raceRouter);

apiRouter.use(Paths.Monstre.Base, monstreRouter);

export default apiRouter;
