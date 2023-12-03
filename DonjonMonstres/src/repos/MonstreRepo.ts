import EnvVars from "@src/constants/EnvVars";
import { MONSTRE_NOT_FOUND_DELETE_ERROR, MONSTRE_NOT_FOUND_UPDATE_ERROR } from "@src/constants/Erreurs";
import { IMonstre } from "@src/models/Monstre";
import Monstre from "@src/models/Monstre";
import { ObjectId, connect } from "mongoose";

/**
 * Indique si un monstre portant cet id existe
 * 
 * @param id l'id du monstre
 * @returns si le monstre existe
 */
async function persists(id: ObjectId) : Promise<Boolean> {
    await connect(EnvVars.MongoDb_URI, { dbName: "Monstres" });

    const monstre = await Monstre.findById(id);
    return monstre !== null;
}

/**
 * Retourne tous les monstres
 */
async function getAll() : Promise<IMonstre[]> {
    await connect(EnvVars.MongoDb_URI, { dbName: "Monstres" });

    const monstres = await Monstre.find();
    return monstres;
}

/**
 * Retourne un monstre
 * @param id l'id du monstre
 * @returns Le monstre
 */
async function getById(id: ObjectId) : Promise<IMonstre | undefined> {
    await connect(EnvVars.MongoDb_URI, { dbName: "Monstres" });

    const monstre = await Monstre.findById(id);
    if (monstre !== null) {
        return monstre;
    }

    return undefined;
}

/**
 * Trouve le monstre ayant le plus d'aventuriers vaincus
 * 
 * @returns Le monstre
 */
async function getMonstreLePlusMortel() : Promise<IMonstre | undefined> {
    await connect(EnvVars.MongoDb_URI, { dbName: "Monstres" });

    const monstres = await Monstre.find();
    monstres.sort((premier : IMonstre, deuxieme : IMonstre) => {return deuxieme.aventuriersVaincus.length - premier.aventuriersVaincus.length});

    return monstres[0];
}

/**
 * Trouve le monstre ayant le plus d'amis monstres
 * 
 * @returns Le monstre
 */
async function getMonstreLePlusAmical() : Promise<IMonstre | undefined> {
    await connect(EnvVars.MongoDb_URI, { dbName: "Monstres" });

    const monstres = await Monstre.find();
    monstres.sort((premier : IMonstre, deuxieme : IMonstre) => {return deuxieme.amisId.length - premier.amisId.length});

    return monstres[0];
}

/**
 * Insère un monstre
 * 
 * @param monstre Le monstre
 * @returns Le monstre inséré
 */
async function insert(monstre: IMonstre) : Promise<IMonstre> {
    await connect(EnvVars.MongoDb_URI, { dbName: "Monstres" });

    const nouveauMonstre = new Monstre(monstre);
    nouveauMonstre.save();
    return nouveauMonstre;
}

/**
 * Mets à jour un monstre
 * @param monstre Le nouveau monstre
 * @returns Le monstre modifié
 */
async function update(monstre: IMonstre) : Promise<IMonstre> {
    await connect(EnvVars.MongoDb_URI, { dbName: "Monstres" });

    const monstrePourChanger = await Monstre.findById(monstre._id);
    if (monstrePourChanger === null) {
        throw new Error(MONSTRE_NOT_FOUND_UPDATE_ERROR);
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

/**
 * Supprime un monstre
 * @param id L'id du monstre
 */
async function _delete(id: ObjectId) : Promise<void> {
    await connect(EnvVars.MongoDb_URI, { dbName: "Monstres" });
    
    if (!await persists(id)) {
        throw Error(MONSTRE_NOT_FOUND_DELETE_ERROR);
    }

    await Monstre.findByIdAndDelete(id);
}

/**
 * supprime tous les monstres d'une certaine race
 * @param raceId L'id de la race
 */
async function deleteAllFromRace(raceId: ObjectId) : Promise<void> {
    await connect(EnvVars.MongoDb_URI, { dbName: "Monstres" });

    const monstres = await Monstre.find({ raceId : raceId });

    for (const monstre of monstres) {
        await _delete(monstre.id);
    }
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