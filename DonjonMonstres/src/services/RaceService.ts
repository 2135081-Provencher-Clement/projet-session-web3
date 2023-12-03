import { IRace } from "@src/models/Race";
import RaceRepo from "@src/repos/RaceRepo";
import { ObjectId } from "mongoose";

/**
 * Indique si une race portant cet id existe
 * @param id l'id de la race
 * @returns si la race existe
 */
async function persists(id: ObjectId) : Promise<Boolean> {
    return RaceRepo.persists(id);
}

/**
 * Trouve tous les races
 * @returns tous les races
 */
async function getAll() : Promise<IRace[]> {
    const races = await RaceRepo.getAll();
    return races;
}

/**
 * Trouve un id selon un nom de race
 * @param nom Le nom de race
 * @returns l'id de la reace
 */
async function getById(id: ObjectId) : Promise<IRace | undefined> {
    const race = await RaceRepo.getById(id);
    return race;
}

/**
 * Trouve un race selon un id
 * @param id L'id de la race
 * @returns La race
 */
async function getIdParNom(nom: String) : Promise<ObjectId | undefined> {
    const id = await RaceRepo.getIdParNom(nom);
    return id;
}

/**
 * Insère une race
 * @param race La race à insérer
 * @returns La race insérée
 */
async function insert(race : IRace) : Promise<IRace> {
    const nouvelleRace = await RaceRepo.insert(race);
    return nouvelleRace;
}

/**
 * Mets à jour une race
 * @param race La race à mettre à jour
 * @returns La race modifiée
 */
async function update(race : IRace) : Promise<IRace> {
    const raceModifie = await RaceRepo.update(race);
    return raceModifie;
}

/**
 * Supprime une race
 * @param id L'id de la race
 */
async function _delete(id: ObjectId) : Promise<void> {
    await RaceRepo.delete(id);
}

/**
 * Supprime tous les races d'un élément
 * @param elementId L'id de l'élément
 */
async function deleteAllFromElement(elementId : ObjectId) : Promise<void> {
    await RaceRepo.deleteAllFromElement(elementId);
}

export default {
    persists,
    getAll,
    getById,
    getIdParNom,
    insert,
    update,
    delete : _delete,
    deleteAllFromElement
}