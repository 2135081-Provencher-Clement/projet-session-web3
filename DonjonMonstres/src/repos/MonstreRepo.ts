import { IMonstre } from "@src/models/Monstre";
import Monstre from "@src/models/Monstre";
import { ObjectId } from "mongoose";

async function persists(id: ObjectId) : Promise<Boolean> {
    const monstre = await Monstre.findById(id);
    return monstre !== null;
}

async function getAll() : Promise<IMonstre[]> {
    const monstres = await Monstre.find();
    return monstres;
}

async function getById(id: ObjectId) : Promise<IMonstre | undefined> {
    const monstre = await Monstre.findById(id);
    if (monstre !== null) {
        return monstre;
    }

    return undefined;
}

// TODO faire plus de get pour les monstres

async function insert(monstre: IMonstre) : Promise<IMonstre> {
    const nouveauMonstre = new Monstre(monstre);
    nouveauMonstre.save();
    return nouveauMonstre;
}

async function update(monstre: IMonstre) : Promise<IMonstre> {
    const monstrePourChanger = await Monstre.findById(monstre._id);
    if (monstrePourChanger === null) {
        throw new Error("Monstre introuvable, mise à jour impossible");
    }

    monstrePourChanger.nom = monstre.nom;
    monstrePourChanger.raceId = monstre.raceId;
    monstrePourChanger.niveau = monstre.niveau;
    monstrePourChanger.age = monstre.age;
    monstrePourChanger.amisId = monstre.amisId;
    monstrePourChanger.dateNaissance = monstre.dateNaissance;
    monstrePourChanger.aventuriersVaincus = monstre.aventuriersVaincus;

    monstrePourChanger.save();

    return monstrePourChanger;
}

async function _delete(id: ObjectId) {
    if (!await persists(id)) {
        throw Error("Monstre introuvable, supression impossible");
    }

    await Monstre.findByIdAndDelete(id);
}

async function deleteAllFromRace(raceId: ObjectId) {
    const monstres = await Monstre.find({ raceId : raceId });

    for (const monstre of monstres) {
        await _delete(monstre.id);
    }
}


export default {
    persists,
    getAll,
    getById,
    insert,
    update,
    delete : _delete,
    deleteAllFromRace
}