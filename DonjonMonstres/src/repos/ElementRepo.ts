import { IElement } from "@src/models/Element";
import Element from "@src/models/Element";
import { error } from "console";
import { ObjectId, connect } from "mongoose";
import RaceRepo from "./RaceRepo";
import { ELEMENT_NOT_FOUND_DELETE_ERROR, ELEMENT_NOT_FOUND_UPDATE_ERROR } from "@src/constants/Erreurs";
import EnvVars from "@src/constants/EnvVars";

/**
 * Indique si un élément portant cet id existe
 * 
 * @param id l'id de l'élément
 * @returns si l'élément existe
 */
async function persists(id: ObjectId) : Promise<Boolean> {
    await connect(EnvVars.MongoDb_URI, { dbName: "Monstres" });
    
    const element = await Element.findById(id);
    return element !== null;
}

/**
 * Retourne tous les éléments
 * @returns tous les éléments
 */
async function getAll() : Promise<IElement[]> {
    await connect(EnvVars.MongoDb_URI, { dbName: "Monstres" });

    const elements = await Element.find();
    return elements;
}

/**
 * Trouve un id selon un nom d'élément
 * @param nom le nom de l'élément
 * @returns l'id de l'élément
 */
async function getIdParNom(nom: String) : Promise<ObjectId | undefined> {
    await connect(EnvVars.MongoDb_URI, { dbName: "Monstres" });

    const element = await Element.findOne({nom : nom});
    if (element !== null) {
        return element._id;
    }
    return undefined;
}

/**
 * Trouve le nom d'un élément selon un nom
 * @param id l'id de l'élément
 * @returns le nom de l'élément
 */
async function getNomParId(id: ObjectId) : Promise<String | undefined> {
    await connect(EnvVars.MongoDb_URI, { dbName: "Monstres" });

    const element = await Element.findById(id);
    if (element !== null) {
        return element.nom;
    }
    return undefined;
}

/**
 * Insère un élément
 * @param element l'élément à insérer
 * @returns l'élément inséré
 */
async function insert(element: IElement) : Promise<IElement> {
    await connect(EnvVars.MongoDb_URI, { dbName: "Monstres" });

    const nouvelElement = new Element(element);
    await nouvelElement.save()
    return nouvelElement
}

/**
 * Mets à jour un élément
 * @param element l'élément à mettre à jour
 * @returns l'élément modifié
 */
async function update(element: IElement) : Promise<IElement> {
    await connect(EnvVars.MongoDb_URI, { dbName: "Monstres" });

    const elementPourModifier = await Element.findById(element._id);
    if (elementPourModifier === null) {
        throw new Error(ELEMENT_NOT_FOUND_UPDATE_ERROR);
    }

    elementPourModifier.nom = element.nom;

    elementPourModifier.save();

    return elementPourModifier;
}

/**
 * Supprime un élément
 * @param id l'id de l'élément à supprimer
 */
async function _delete(id: ObjectId) : Promise<void> {
    await connect(EnvVars.MongoDb_URI, { dbName: "Monstres" });
    
    if (!await persists(id)) {
        throw new Error(ELEMENT_NOT_FOUND_DELETE_ERROR)
    }

    await RaceRepo.deleteAllFromElement(id);

    await Element.findByIdAndDelete(id);
}

export default {
    persists,
    getAll,
    getIdParNom,
    getNomParId,
    insert,
    update,
    delete : _delete
}