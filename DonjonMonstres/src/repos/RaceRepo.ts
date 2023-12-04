import { IRace } from "@src/models/Race";
import Race from "@src/models/Race";
import { ObjectId, connect } from "mongoose";
import MonstreRepo from "./MonstreRepo";
import { RACE_NOT_FOUND_DELETE_ERROR, RACE_NOT_FOUND_UPDATE_ERROR } from "@src/constants/Erreurs";
import EnvVars from "@src/constants/EnvVars";

/**
 * Indique si une race portant cet id existe
 * @param id l'id de la race
 * @returns si la race existe
 */
async function persists(id: ObjectId) : Promise<Boolean> {
    await connect(EnvVars.MongoDb_URI, { dbName: "Monstres" });

    const race = await Race.findById(id);
    return race !== null;
}

/**
 * Trouve tous les races
 * @returns tous les races
 */
async function getAll() : Promise<IRace[]> {
    await connect(EnvVars.MongoDb_URI, { dbName: "Monstres" });

    const races = await Race.find();
    return races;
}

/**
 * Trouve un id selon un nom de race
 * @param nom Le nom de race
 * @returns l'id de la reace
 */
async function getIdParNom(nom: String) : Promise<ObjectId | undefined> {
    await connect(EnvVars.MongoDb_URI, { dbName: "Monstres" });

    const race = await Race.findOne({nom : nom});
    if (race !== null) {
        return race.id;
    }

    return undefined;
}

/**
 * Trouve un race selon un id
 * @param id L'id de la race
 * @returns La race
 */
async function getById(id: ObjectId) : Promise<IRace | undefined> {
    await connect(EnvVars.MongoDb_URI, { dbName: "Monstres" });

    const race = await Race.findById(id);
    if (race !== null) {
        return race;
    }

    return undefined;
}

/**
 * Insère une race
 * @param race La race à insérer
 * @returns La race insérée
 */
async function insert(race: IRace) : Promise<IRace> {
    await connect(EnvVars.MongoDb_URI, { dbName: "Monstres" });

    const nouvelleRace = new Race(race);
    nouvelleRace.save();
    return nouvelleRace;
}

/**
 * Mets à jour une race
 * @param race La race à mettre à jour
 * @returns La race modifiée
 */
async function update(race: IRace) : Promise<IRace> {
    await connect(EnvVars.MongoDb_URI, { dbName: "Monstres" });

    const racePourChanger = await Race.findById(race._id);
    if (racePourChanger === null) {
        throw new Error(RACE_NOT_FOUND_UPDATE_ERROR);
    }

    racePourChanger.nom = race.nom;
    racePourChanger.elementId = race.elementId;
    racePourChanger.reproductionAsexuelle = race.reproductionAsexuelle;

    racePourChanger.save();

    return racePourChanger;
}

/**
 * Supprime une race
 * @param id L'id de la race
 */
async function _delete(id: ObjectId) : Promise<void> {
    await connect(EnvVars.MongoDb_URI, { dbName: "Monstres" });

    if (!await persists(id)) {
        throw Error(RACE_NOT_FOUND_DELETE_ERROR);
    }

    await MonstreRepo.deleteAllFromRace(id);

    await Race.findByIdAndDelete(id);
}

/**
 * Supprime tous les races d'un élément
 * @param elementId L'id de l'élément
 */
async function deleteAllFromElement(elementId: ObjectId) : Promise<void> {
    await connect(EnvVars.MongoDb_URI, { dbName: "Monstres" });
    
    const races = await Race.find({elementId : elementId});

    for (const race of races) {
        await _delete(race.id);
    }
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