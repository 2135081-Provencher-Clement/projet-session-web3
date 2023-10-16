import { IRace } from "@src/models/Race";
import RaceService from "@src/services/RaceService";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { IRes, IReq } from "./types/types";
import { ID_INVALIDE_ERROR, RACE_NOT_FOUND_DELETE_ERROR, RACE_NOT_FOUND_UPDATE_ERROR } from "@src/constants/Erreurs";

async function getAll(request : IReq, result : IRes) {
    const races = await RaceService.getAll();
    return result.status(HttpStatusCodes.OK).json({races});
}

async function getById(request : IReq, result : IRes) {
    const id = request.params.id;

    // Solution trouvée à : https://stackoverflow.com/questions/6578178/node-js-mongoose-js-string-to-objectid-function
    var mongoose = require('mongoose');
    const objectId = mongoose.Types.ObjectId(id);
    // Fin code emprunté

    const race = await RaceService.getById(objectId);

    if (race === undefined) {
        return result.status(HttpStatusCodes.NOT_FOUND).json({erreur : ID_INVALIDE_ERROR})
    }

    return result.status(HttpStatusCodes.OK).json({race});
}

async function getIdParNom(request : IReq, result : IRes) {
    const nom = request.params.nom;
    const id = await RaceService.getIdParNom(nom);

    if (id === undefined) {
        return result.status(HttpStatusCodes.NOT_FOUND);
    }

    return result.status(HttpStatusCodes.OK).json({id});
}

async function insert(request : IReq<{race : IRace}>, result : IRes) {
    const { race } = request.body;
    const nouvelleRace = await RaceService.insert(race);
    return result.status(HttpStatusCodes.CREATED).json({race : nouvelleRace})
}

async function update(request : IReq<{race : IRace}>, result : IRes) {
    const { race } = request.body;

    if (!RaceService.persists(race._id)) {
        return result.status(HttpStatusCodes.NOT_FOUND).json({erreur : RACE_NOT_FOUND_UPDATE_ERROR});
    }

    try {
        const raceModifie = await RaceService.update(race); // Lancera une erreur si la race n'est pas trouvé
        return result.status(HttpStatusCodes.OK).json({race : raceModifie});
    }
    catch (erreur) {
        return result.status(HttpStatusCodes.NOT_FOUND).json({erreur});
    }
}

async function _delete(request : IReq, result : IRes) {
    const id = request.params.id;

    // Solution trouvée à : https://stackoverflow.com/questions/6578178/node-js-mongoose-js-string-to-objectid-function
    var mongoose = require('mongoose');
    const objectId = mongoose.Types.ObjectId(id);
    // Fin code emprunté

    if(!RaceService.persists(objectId)) {
        return result.status(HttpStatusCodes.NOT_FOUND).json({erreur : RACE_NOT_FOUND_DELETE_ERROR});
    }

    try {
        await RaceService.delete(objectId); // Lancera une erreur si la race n'est pas trouvée
        return result.status(HttpStatusCodes.OK).end();
    }
    catch (erreur) {
        return result.status(HttpStatusCodes.NOT_FOUND).json({erreur});
    }
}

export default {
    getAll,
    getById,
    getIdParNom,
    insert,
    update,
    delete : _delete
}