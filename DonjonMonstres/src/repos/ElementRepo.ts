import { IElement } from "@src/models/Element";
import Element from "@src/models/Element";
import { error } from "console";
import { ObjectId } from "mongoose";
import RaceRepo from "./RaceRepo";
import { ELEMENT_NOT_FOUND_DELETE_ERROR, ELEMENT_NOT_FOUND_UPDATE_ERROR } from "@src/constants/Erreurs";

async function persists(id: ObjectId) : Promise<Boolean> {
    const element = await Element.findById(id);
    return element !== null;
}

async function getAll() : Promise<IElement[]> {
    const elements = await Element.find();
    return elements;
}

async function getIdParNom(nom: String) : Promise<ObjectId | undefined> {
    const element = await Element.findOne({nom : nom});
    if (element !== null) {
        return element._id;
    }
    return undefined;
}

async function getNomParId(id: ObjectId) : Promise<String | undefined> {
    const element = await Element.findById(id);
    if (element !== null) {
        return element.nom;
    }
    return undefined;
}

async function insert(element: IElement) : Promise<IElement> {
    const nouvelElement = new Element(element);
    nouvelElement.save();
    return nouvelElement
}

async function update(element: IElement) : Promise<IElement> {
    const elementPourModifier = await Element.findById(element._id);
    if (elementPourModifier === null) {
        throw new Error(ELEMENT_NOT_FOUND_UPDATE_ERROR);
    }

    elementPourModifier.nom = element.nom;

    elementPourModifier.save();

    return elementPourModifier;
}

async function _delete(id: ObjectId) : Promise<void> {
    
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