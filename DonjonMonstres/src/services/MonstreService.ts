import { IMonstre } from "@src/models/Monstre";
import MonstreRepo from "@src/repos/MonstreRepo";
import { ObjectId } from "mongoose";

/**
 * Indique si un monstre portant cet id existe
 * 
 * @param id l'id du monstre
 * @returns si le monstre existe
 */
async function persists(id: ObjectId) : Promise<Boolean> {
    return MonstreRepo.persists(id);
}

/**
 * Retourne tous les monstres
 */
async function getAll() : Promise<IMonstre[]> {
    const monstres = await MonstreRepo.getAll();
    return monstres;
}

/**
 * Retourne un monstre
 * @param id l'id du monstre
 * @returns Le monstre
 */
async function getById(id: ObjectId) : Promise<IMonstre | undefined> {
    const monstre = await MonstreRepo.getById(id);
    return monstre;
}

/**
 * Trouve le monstre ayant le plus d'aventuriers vaincus
 * 
 * @returns Le monstre
 */
async function getMonstreLePlusMortel() : Promise<IMonstre | undefined> {
    const monstreMortel = MonstreRepo.getMonstreLePlusMortel();
    return monstreMortel;
}

/**
 * Trouve le monstre ayant le plus d'amis monstres
 * 
 * @returns Le monstre
 */
async function getMonstreLePlusAmical() : Promise<IMonstre | undefined> {
    const monstreAmical = MonstreRepo.getMonstreLePlusAmical();
    return monstreAmical
}

/**
 * Insère un monstre
 * 
 * @param monstre Le monstre
 * @returns Le monstre inséré
 */
async function insert(monstre : IMonstre) : Promise<IMonstre> {
    const nouveauMonstre = await MonstreRepo.insert(monstre);
    return nouveauMonstre;
}

/**
 * Mets à jour un monstre
 * @param monstre Le nouveau monstre
 * @returns Le monstre modifié
 */
async function update(monstre : IMonstre) : Promise<IMonstre> {
    const monstreModifie = await MonstreRepo.update(monstre);
    return monstreModifie;
}

/**
 * Supprime un monstre
 * @param id L'id du monstre
 */
async function _delete(id: ObjectId) : Promise<void> {
    await MonstreRepo.delete(id);
}

/**
 * supprime tous les monstres d'une certaine race
 * @param raceId L'id de la race
 */
async function deleteAllFromRace(raceId : ObjectId) : Promise<void> {
    await MonstreRepo.deleteAllFromRace(raceId);
}

export default {
    persists,
    getAll,
    getById,
    getMonstreLePlusMortel,
    getMonstreLePlusAmical,
    insert,
    update,
    delete : _delete,
    deleteAllFromRace
}