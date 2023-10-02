import { IElement } from "@src/models/Element";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import ElementService from "@src/services/ElementService";
import { IReq, IRes } from "./types/types";
import { ELEMENT_NOT_FOUND_DELETE_ERROR, ELEMENT_NOT_FOUND_UPDATE_ERROR, ID_INVALIDE_ERROR } from "@src/constants/Erreurs";
import { request } from "http";
import { ObjectId } from "mongoose";

async function getAll(request : IReq, result : IRes) {
    const elements = await ElementService.getAll();
    return result.status(HttpStatusCodes.OK).json({elements});
}

async function getIdParNom(request : IReq, result : IRes) {
    const nom = request.params.nom;
    const id = await ElementService.getIdParNom(nom);

    if (id === undefined) {
        return result.status(HttpStatusCodes.NOT_FOUND);
    }

    return result.status(HttpStatusCodes.OK).json({id});
}

async function insert(request : IReq<{element : IElement}>, result : IRes) {
    const { element } = request.body;
    const nouvelElement = await ElementService.insert(element);
    return result.status(HttpStatusCodes.CREATED).json({nouvelElement});
}

async function update(request : IReq<{element : IElement}>, result : IRes) {
    const { element } = request.body;

    if (!ElementService.persists(element._id)) {
        return result.status(HttpStatusCodes.NOT_FOUND).json({erreur : ELEMENT_NOT_FOUND_UPDATE_ERROR});
    }

    try {
        const elementModifie = await ElementService.update(element); // Lancera une erreur si l'élément n'est pas trouvé
        return result.status(HttpStatusCodes.CREATED).json({elementModifie});
    }
    catch (erreur) {
        return result.status(HttpStatusCodes.NOT_FOUND).json({erreur});
    }
}

async function _delete(request : IReq, result : IRes) {
    const stringId = request.params.id;
    let id : ObjectId;

    try {
        id = stringId as unknown as ObjectId
    }
    catch (erreur) {
        return result.status(HttpStatusCodes.BAD_REQUEST).json({erreur : ID_INVALIDE_ERROR});
    }

    if (!ElementService.persists(id)) {
        return result.status(HttpStatusCodes.NOT_FOUND).json({erreur : ELEMENT_NOT_FOUND_DELETE_ERROR});
    }

    try {
        await ElementService.delete(id);
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