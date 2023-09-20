import { IMonstre } from "@src/models/Monstre";
import Monstre from "@src/models/Monstre";
import { ObjectId } from "mongoose";

async function persists(id: ObjectId) : Promise<Boolean> {
    const monstre = await Monstre.findById(id);
    return monstre !== null;
}


export default {
    persists
}