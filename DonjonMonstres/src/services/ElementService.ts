import { IElement } from "@src/models/Element";
import ElementRepo from "@src/repos/ElementRepo";
import { ObjectId } from "mongoose";

async function persists(id: ObjectId) : Promise<Boolean> {
    return ElementRepo.persists(id);
}

async function getAll() : Promise<IElement[]> {
    const elements = await ElementRepo.getAll();
    return elements;
}

async function getIdParNom(nom: String) : Promise<ObjectId | undefined> {
    const element = await ElementRepo.getIdParNom(nom);
    return element;
}

async function insert(element: IElement) : Promise<IElement> {
    const nouvelelement = await ElementRepo.insert(element);
    return nouvelelement;
}

async function update(element : IElement) : Promise<IElement> {
    const elementModifie = await ElementRepo.update(element);
    return elementModifie;
}

async function _delete(id: ObjectId) : Promise<void> {
    await ElementRepo.delete(id);
}

export default {
    persists,
    getAll,
    getIdParNom,
    insert,
    update,
    delete : _delete
}