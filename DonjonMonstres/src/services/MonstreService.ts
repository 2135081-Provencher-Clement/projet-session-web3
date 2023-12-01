import { IMonstre } from "@src/models/Monstre";
import MonstreRepo from "@src/repos/MonstreRepo";
import { ObjectId } from "mongoose";

async function persists(id: ObjectId) : Promise<Boolean> {
    return MonstreRepo.persists(id);
}

async function getAll() : Promise<IMonstre[]> {
    const monstres = await MonstreRepo.getAll();
    return monstres;
}

async function getById(id: ObjectId) : Promise<IMonstre | undefined> {
    const monstre = await MonstreRepo.getById(id);
    return monstre;
}

async function getMonstreLePlusMortel() : Promise<IMonstre | undefined> {
    const monstreMortel = MonstreRepo.getMonstreLePlusMortel();
    return monstreMortel;
}

async function insert(monstre : IMonstre) : Promise<IMonstre> {
    const nouveauMonstre = await MonstreRepo.insert(monstre);
    return nouveauMonstre;
}

async function update(monstre : IMonstre) : Promise<IMonstre> {
    const monstreModifie = await MonstreRepo.update(monstre);
    return monstreModifie;
}

async function _delete(id: ObjectId) : Promise<void> {
    await MonstreRepo.delete(id);
}

async function deleteAllFromRace(raceId : ObjectId) : Promise<void> {
    await MonstreRepo.deleteAllFromRace(raceId);
}

export default {
    persists,
    getAll,
    getById,
    getMonstreLePlusMortel,
    insert,
    update,
    delete : _delete,
    deleteAllFromRace
}