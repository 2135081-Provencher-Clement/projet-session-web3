import IRace from "@src/models/Race";
import Race from "@src/models/Race";
import { ObjectId } from "mongoose";

async function persists(id: ObjectId) : Promise<Boolean> {
    const race = await Race.findById(id);
    return race !== null;
}


export default {
    persists
}