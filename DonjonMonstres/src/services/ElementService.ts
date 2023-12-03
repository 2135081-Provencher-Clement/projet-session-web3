import { IElement } from "@src/models/Element";
import ElementRepo from "@src/repos/ElementRepo";
import { ObjectId } from "mongoose";

/**
 * Indique si un élément portant cet id existe
 * 
 * @param id l'id de l'élément
 * @returns si l'élément existe
 */
async function persists(id: ObjectId) : Promise<Boolean> {
    return ElementRepo.persists(id);
}

/**
 * Retourne tous les éléments
 * @returns tous les éléments
 */
async function getAll() : Promise<IElement[]> {
    const elements = await ElementRepo.getAll();
    return elements;
}

/**
 * Trouve un id selon un nom d'élément
 * @param nom le nom de l'élément
 * @returns l'id de l'élément
 */
async function getIdParNom(nom: String) : Promise<ObjectId | undefined> {
    const element = await ElementRepo.getIdParNom(nom);
    return element;
}

/**
 * Trouve le nom d'un élément selon un nom
 * @param id l'id de l'élément
 * @returns le nom de l'élément
 */
async function getNomParId(id: ObjectId) : Promise<String | undefined> {
    const nomElement = await ElementRepo.getNomParId(id);
    return nomElement;
}

/**
 * Insère un élément
 * @param element l'élément à insérer
 * @returns l'élément inséré
 */
async function insert(element: IElement) : Promise<IElement> {
    const nouvelelement = await ElementRepo.insert(element);
    return nouvelelement;
}

/**
 * Mets à jour un élément
 * @param element l'élément à mettre à jour
 * @returns l'élément modifié
 */
async function update(element : IElement) : Promise<IElement> {
    const elementModifie = await ElementRepo.update(element);
    return elementModifie;
}

/**
 * Supprime un élément
 * @param id l'id de l'élément à supprimer
 */
async function _delete(id: ObjectId) : Promise<void> {
    await ElementRepo.delete(id);
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