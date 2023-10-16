import { IRace } from "@src/models/Race";
import Race from "@src/models/Race";
import { error } from "console";
import { ObjectId } from "mongoose";
import MonstreRepo from "./MonstreRepo";
import { RACE_NOT_FOUND_DELETE_ERROR, RACE_NOT_FOUND_UPDATE_ERROR } from "@src/constants/Erreurs";

async function persists(id: ObjectId) : Promise<Boolean> {
    const race = await Race.findById(id);
    return race !== null;
}

async function getAll() : Promise<IRace[]> {
    const races = await Race.find();
    return races;
}

async function getIdParNom(nom: String) : Promise<ObjectId | undefined> {
    const race = await Race.findOne({nom : nom});

    if (race !== null) {
        return race.id;
    }

    return undefined;
}

async function getById(id: ObjectId) : Promise<IRace | undefined> {
    const race = await Race.findById(id);
    if (race !== null) {
        return race;
    }

    return undefined;
}

async function insert(race: IRace) : Promise<IRace> {
    const nouvelleRace = new Race(race);
    nouvelleRace.save();
    return nouvelleRace;
}

async function update(race: IRace) : Promise<IRace> {
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

async function _delete(id: ObjectId) : Promise<void> {
    if (!await persists(id)) {
        throw Error(RACE_NOT_FOUND_DELETE_ERROR);
    }

    await MonstreRepo.deleteAllFromRace(id);

    await Race.findByIdAndDelete(id);
}

async function deleteAllFromElement(elementId: ObjectId) : Promise<void> {
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