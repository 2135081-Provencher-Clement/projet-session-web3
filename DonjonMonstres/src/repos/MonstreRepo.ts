import { MONSTRE_NOT_FOUND_DELETE_ERROR, MONSTRE_NOT_FOUND_UPDATE_ERROR } from "@src/constants/Erreurs";
import { IMonstre, IMonstreLePlusMortel } from "@src/models/Monstre";
import Monstre from "@src/models/Monstre";
import { rejects } from "assert";
import { ObjectId } from "mongoose";
import { resolve } from "path";


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

async function getMonstreLePlusMortel() : Promise<IMonstreLePlusMortel | undefined> {

    // Cette requête aggregate à été conçue avec l'aide de ChatGPT (Le 29 novembre 2023)
    return new Promise((resolve, rejects) => {
            Monstre.aggregate<IMonstreLePlusMortel>([
            {
                $project: {
                    _id: 1,
                    aventuriersVaincusCount: { $size: { $ifNull: ["$aventuriersVaincus", []] } }
                }
            },
            {
                $sort: { aventuriersVaincusCount: -1 }
            },
            {
                $limit: 1
            }
        ], (erreur : any, monstreLePlusMortel : IMonstreLePlusMortel[]) => {
            if (erreur) {
                console.log("il y a eu une erreur");
                rejects(erreur);
            } else {
                console.log(monstreLePlusMortel);
                if (monstreLePlusMortel.length > 0) {
                    resolve(monstreLePlusMortel[0]);
                } else {
                    resolve(undefined);
                }
            }
        });
    });
}

async function insert(monstre: IMonstre) : Promise<IMonstre> {
    const nouveauMonstre = new Monstre(monstre);
    nouveauMonstre.save();
    return nouveauMonstre;
}

async function update(monstre: IMonstre) : Promise<IMonstre> {
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

async function _delete(id: ObjectId) : Promise<void> {
    if (!await persists(id)) {
        throw Error(MONSTRE_NOT_FOUND_DELETE_ERROR);
    }

    await Monstre.findByIdAndDelete(id);
}

async function deleteAllFromRace(raceId: ObjectId) : Promise<void> {
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
    insert,
    update,
    delete : _delete,
    deleteAllFromRace
}