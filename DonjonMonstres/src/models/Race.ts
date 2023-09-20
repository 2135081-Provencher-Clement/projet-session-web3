import mongoose, { Schema, model, ObjectId } from 'mongoose';


export interface IRace {
    _id : ObjectId;
    nom : String;
    elementId : ObjectId;
    reproductionAsexuelle : Boolean;
}

const RaceSchema = new Schema<IRace>({
    nom : { type : String, required : [true, "Le nom de la race est nécéssaire"]},
    elementId : { type : mongoose.Schema.Types.ObjectId, required : [true, "L'id de l'élément est requis"], validate : [ verifierElement, "Aucun élément ne porte l'id fourni" ] },
    reproductionAsexuelle : { type : Boolean, required : [true, "La reproduction asexuelle est obligatoire"]}
})


function verifierElement(id : ObjectId) {
    return true; // TODO faire la vérification avec le repo d'élément
}

mongoose.pluralize(null);
export default model<IRace>("races", RaceSchema);