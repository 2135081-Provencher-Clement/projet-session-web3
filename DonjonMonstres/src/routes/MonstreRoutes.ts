import { IMonstre } from "@src/models/Monstre";
import MonstreService from "@src/services/MonstreService";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { IReq, IRes } from "./types/express/misc";
import { ID_INVALIDE_ERROR, MONSTRE_AMICAL_INTROUVABLE, MONSTRE_MORTEL_INTROUVABLE, MONSTRE_NOT_FOUND_DELETE_ERROR, MONSTRE_NOT_FOUND_UPDATE_ERROR } from "@src/constants/Erreurs";

/**
 * Trouve tous les monstres
 */
async function getAll(request : IReq, result : IRes) {
    const monstres = await MonstreService.getAll();
    return result.status(HttpStatusCodes.OK).json({monstres});
}

/**
 * Trouve un monstre selon l'id
 */
async function getById(request : IReq, result : IRes) {
    const id = request.params.id;

    // Solution trouvée à : https://stackoverflow.com/questions/6578178/node-js-mongoose-js-string-to-objectid-function
    var mongoose = require('mongoose');
    const objectId = new mongoose.Types.ObjectId(id);
    // Fin code emprunté

    const monstre = await MonstreService.getById(objectId);

    if (monstre === undefined) {
        return result.status(HttpStatusCodes.BAD_REQUEST).json({erreur : ID_INVALIDE_ERROR});
    }

    return result.status(HttpStatusCodes.OK).json({monstre});
}

/**
 * Trouve le monstre avec le plus d'aventuriers vaincus
 */
async function getMonstreLePlusMortel(request : IReq, result : IRes) {
    const monstreMortel = await MonstreService.getMonstreLePlusMortel();

    if(monstreMortel === undefined) {
        return result.status(HttpStatusCodes.NOT_FOUND).json({erreur : MONSTRE_MORTEL_INTROUVABLE});
    }

    return result.status(HttpStatusCodes.OK).json({ "nomMonstre" : monstreMortel.nom, "nombreVictimes" : monstreMortel.aventuriersVaincus.length});
    
}

/**
 * Trouve le monstre avec le plus d'amis
 */
async function getMonstreLePlusAmical(request : IReq, result : IRes) {
    const monstreAmical = await MonstreService.getMonstreLePlusAmical();

    if(monstreAmical === undefined) {
        return result.status(HttpStatusCodes.NOT_FOUND).json({erreur : MONSTRE_AMICAL_INTROUVABLE});
    }

    return result.status(HttpStatusCodes.OK).json({ "nomMonstre" : monstreAmical.nom, "nombreAmis" : monstreAmical.amisId.length});
}

/**
 * Insère un monstre
 */
async function insert(request : IReq<{monstre : IMonstre}>, result : IRes) {
    const { monstre } = request.body;
    const nouveauMonstre = await MonstreService.insert(monstre);
    return result.status(HttpStatusCodes.CREATED).json({monstre : nouveauMonstre})
}

/**
 * Mets à jour un monstre
 */
async function update(request : IReq<{monstre : IMonstre}>, result : IRes) {
    const { monstre } = request.body;

    if (!MonstreService.persists(monstre._id)) {
        return result.status(HttpStatusCodes.NOT_FOUND).json({erreur : MONSTRE_NOT_FOUND_UPDATE_ERROR});
    }

    try {
        const monstreModifie = await MonstreService.update(monstre); // Lancera une erreur si le monstre n'est pas trouvé
        return result.status(HttpStatusCodes.OK).json({monstre : monstreModifie});
    }
    catch (erreur) {
        return result.status(HttpStatusCodes.NOT_FOUND).json({erreur : MONSTRE_NOT_FOUND_UPDATE_ERROR});
    }
}

/**
 * Supprime un monstre
 */
async function _delete(request : IReq, result : IRes) {
    const id = request.params.id;

    // Solution trouvée à : https://stackoverflow.com/questions/6578178/node-js-mongoose-js-string-to-objectid-function
    var mongoose = require('mongoose');
    const objectId = new mongoose.Types.ObjectId(id);
    // Fin code emprunté

    if(!MonstreService.persists(objectId)) {
        return result.status(HttpStatusCodes.NOT_FOUND).json({erreur : MONSTRE_NOT_FOUND_DELETE_ERROR});
    }

    try {
        await MonstreService.delete(objectId); // Lancera une erreur si le monstre n'est pas trouvée
        return result.status(HttpStatusCodes.OK).end();
    }
    catch (erreur) {
        return result.status(HttpStatusCodes.NOT_FOUND).json({erreur : MONSTRE_NOT_FOUND_DELETE_ERROR});
    }
}

export default {
    getAll,
    getById,
    getMonstreLePlusMortel,
    getMonstreLePlusAmical,
    insert,
    update,
    delete : _delete
}