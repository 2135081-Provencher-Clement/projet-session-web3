import { IElement } from "@src/models/Element";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import ElementService from "@src/services/ElementService";
import { IReq, IRes } from "./types/types";
import { ELEMENT_NOT_FOUND_DELETE_ERROR, ELEMENT_NOT_FOUND_UPDATE_ERROR, ID_INVALIDE_ERROR } from "@src/constants/Erreurs";

async function getAll(request : IReq, result : IRes) {
    const elements = await ElementService.getAll();
    return result.status(HttpStatusCodes.OK).json({elements});
}

async function getIdParNom(request : IReq, result : IRes) {
    const nom = request.params.nom;
    const id = await ElementService.getIdParNom(nom);

    if (id === undefined || id === null) {
        return result.status(HttpStatusCodes.NOT_FOUND);
    }

    return result.status(HttpStatusCodes.OK).json({id});
}

async function insert(request : IReq<{element : IElement}>, result : IRes) {
    const { element } = request.body;
    const nouvelElement = await ElementService.insert(element);
    return result.status(HttpStatusCodes.CREATED).json({element : nouvelElement});
}

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
        return result.status(HttpStatusCodes.NOT_FOUND).json({erreur});
    }
}

async function _delete(request : IReq, result : IRes) {
    const id = request.params.id;

    // Solution trouvée à : https://stackoverflow.com/questions/6578178/node-js-mongoose-js-string-to-objectid-function
    var mongoose = require('mongoose');
    const objectId = mongoose.Types.ObjectId(id);
    // Fin code emprunté

    if (!ElementService.persists(objectId)) {
        return result.status(HttpStatusCodes.NOT_FOUND).json({erreur : ELEMENT_NOT_FOUND_DELETE_ERROR});
    }

    try {
        await ElementService.delete(objectId); //Lancera une erreur si l'élément n'est pas trouvé
        return result.status(HttpStatusCodes.OK).end();
    }
    catch (erreur) {
        return result.status(HttpStatusCodes.NOT_FOUND).json({erreur});
    }
}

export default {
    getAll,
    getIdParNom,
    insert,
    update,
    delete : _delete
}