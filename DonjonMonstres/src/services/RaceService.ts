import { IRace } from "@src/models/Race";
import RaceRepo from "@src/repos/RaceRepo";
import { ObjectId } from "mongoose";

async function persists(id: ObjectId) : Promise<Boolean> {
    return RaceRepo.persists(id);
}

async function getAll() : Promise<IRace[]> {
    const races = await RaceRepo.getAll();
    return races;
}

async function getNomParId(id: ObjectId) : Promise<String | undefined> {
    const nom = await RaceRepo.getNomParId(id);
    return nom;
}

async function getById(id: ObjectId) : Promise<IRace | undefined> {
    const race = await RaceRepo.getById(id);
    return race;
}

async function insert(race : IRace) : Promise<IRace> {
    const nouvelleRace = await RaceRepo.insert(race);
    return nouvelleRace;
}

async function update(race : IRace) : Promise<IRace> {
    const raceModifie = await RaceRepo.update(race);
    return raceModifie;
}

async function _delete(id: ObjectId) : Promise<void> {
    await RaceRepo.delete(id);
}

async function deleteAllFromElement(elementId : ObjectId) : Promise<void> {
    await RaceRepo.deleteAllFromElement(elementId);
}

export default {
    persists,
    getAll,
    getById,
    getNomParId,
    insert,
    update,
    delete : _delete,
    deleteAllFromElement
}