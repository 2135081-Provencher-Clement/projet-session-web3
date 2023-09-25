import mongoose, { Schema, model, ObjectId } from 'mongoose';
import ElementRepo from "@src/repos/ElementRepo"


export interface IRace {
    _id : ObjectId;
    nom : String;
    elementId : ObjectId;
    reproductionAsexuelle : Boolean;
}

// TODO handle l'erreur possible si un nom déjà existant est entrée (code : 11000)
const RaceSchema = new Schema<IRace>({
    nom : { type : String, required : [true, "Le nom de la race est nécéssaire"], unique : true},
    elementId : { type : mongoose.Schema.Types.ObjectId, required : [true, "L'id de l'élément est requis"], validate : [ verifierElement, "Aucun élément ne porte l'id fourni" ] },
    reproductionAsexuelle : { type : Boolean, required : [true, "La reproduction asexuelle est obligatoire"]}
})


async function verifierElement(id : ObjectId) : Promise<Boolean> {
    return await ElementRepo.persists(id);
}

mongoose.pluralize(null);
export default model<IRace>("races", RaceSchema);