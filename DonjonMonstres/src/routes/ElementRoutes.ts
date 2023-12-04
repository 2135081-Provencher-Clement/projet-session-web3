import { IElement } from "@src/models/Element";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import ElementService from "@src/services/ElementService";
import { IReq, IRes } from "./types/express/misc";
import { ELEMENT_NOT_FOUND_DELETE_ERROR, ELEMENT_NOT_FOUND_UPDATE_ERROR, ID_INVALIDE_ERROR, NOM_ELEMENT_NOT_FOUND } from "@src/constants/Erreurs";

/**
 * Trouve tous les éléments
 */
async function getAll(request : IReq, result : IRes) {
    const elements = await ElementService.getAll();
    return result.status(HttpStatusCodes.OK).json({elements});
}

/**
 * Trouve l'id d'un élément selon un nom
 */
async function getIdParNom(request : IReq, result : IRes) {
    const nom = request.params.nom;
    const id = await ElementService.getIdParNom(nom);

    if (id === undefined) {
        return result.status(HttpStatusCodes.NOT_FOUND).json({erreur : NOM_ELEMENT_NOT_FOUND});
    }

    return result.status(HttpStatusCodes.OK).json({id});
}

/**
 * Trouve le nom d'un élément selon un id
 */
async function getNomParId(request : IReq, result : IRes) {
    console.log("debut route getNomParId");
    const id = request.params.id;

    console.log("paramètre id : " + id);
    try {
        // Solution trouvée à : https://stackoverflow.com/questions/6578178/node-js-mongoose-js-string-to-objectid-function
        var mongoose = require('mongoose');
        const objectId = new new mongoose.Types.ObjectId(id);
        // Fin code emprunté

        const nom = await ElementService.getNomParId(objectId);

        if (nom === undefined) {
            return result.status(HttpStatusCodes.BAD_REQUEST).json({erreur : ID_INVALIDE_ERROR})
        }

        return result.status(HttpStatusCodes.OK).json({nom});
    } catch (erreur) {
        return result.status(HttpStatusCodes.BAD_REQUEST).json({erreur : ID_INVALIDE_ERROR})
    }
}

/**
 * Insère un élément
 */
async function insert(request : IReq<{element : IElement}>, result : IRes) {
    const { element } = request.body;

    try {
        const nouvelElement = await ElementService.insert(element);

        return result.status(HttpStatusCodes.CREATED).json({element : nouvelElement});
    } catch (messageErreur) {
        return result.status(HttpStatusCodes.BAD_REQUEST).json({ errer : messageErreur});
    }
    
}

/**
 * Mets à jour un élément
 */
async function update(request : IReq<{element : IElement}>, result : IRes) {
    const { element } = request.body;

    if (!ElementService.persists(element._id)) {
        return result.status(HttpStatusCodes.NOT_FOUND).json({erreur : ELEMENT_NOT_FOUND_UPDATE_ERROR});
    }

    try {
        const elementModifie = await ElementService.update(element); // Lancera une erreur si l'élément n'est pas trouvé
        return result.status(HttpStatusCodes.OK).json({element : elementModifie});
    }
    catch (erreur) {
        return result.status(HttpStatusCodes.NOT_FOUND).json({erreur : ELEMENT_NOT_FOUND_UPDATE_ERROR});
    }
}

/**
 * Supprime un élément
 */
async function _delete(request : IReq, result : IRes) {
    const id = request.params.id;

    // Solution trouvée à : https://stackoverflow.com/questions/6578178/node-js-mongoose-js-string-to-objectid-function
    var mongoose = require('mongoose');
    const objectId = new mongoose.Types.ObjectId(id);
    // Fin code emprunté

    if (!ElementService.persists(objectId)) {
        return result.status(HttpStatusCodes.NOT_FOUND).json({erreur : ELEMENT_NOT_FOUND_DELETE_ERROR});
    }

    try {
        await ElementService.delete(objectId); //Lancera une erreur si l'élément n'est pas trouvé
        return result.status(HttpStatusCodes.OK).end();
    }
    catch (erreur) {
        return result.status(HttpStatusCodes.NOT_FOUND).json({erreur : ELEMENT_NOT_FOUND_DELETE_ERROR});
    }
}

export default {
    getAll,
    getIdParNom,
    getNomParId,
    insert,
    update,
    delete : _delete
}