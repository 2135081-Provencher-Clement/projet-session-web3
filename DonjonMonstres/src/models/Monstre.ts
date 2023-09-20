import mongoose, { Schema, model, ObjectId, Mongoose } from 'mongoose';


export interface IMonstre {
    _id : ObjectId;
    nom : String;
    raceId : String;
    age : Number;
    amisId : [ObjectId];
    dateNaissance : Date;
    aventuriersVaincus : [
        {
            nom : String;
            niveau : Number;
        }
    ];
}

const AventurierSchema = new Schema({
    nom : { type : String, required : [true, "Le nom de l'aventurier est nécéssaire"] },
    niveau : { type : Number, required : [true, "Le niveau de l'aventurier est obligatoire"], validate : [ (niveau : Number) => { return niveau.valueOf() > 0 && niveau.valueOf() <= 30 }, "Le niveau d'un aventurier doit être compris entre 1 et 30" ] }
})

const MonstreSchema = new Schema<IMonstre>({
    nom : { type : String, required : [true, "Le nom du monstre est nécéssaire"] },
    raceId : { type : mongoose.Schema.Types.ObjectId, required : [true, "L'id de la race est obligatoire"], validate : [ validerRace, "Aucune race portant cet id n'existe" ]},
    age : { type : Number, required : [ true, "L'age du monstre est obligatoire" ], validate : [ (age : Number) => { return age.valueOf() > 0; }, "L'age ne peut pas être égal ou inférieur à 0"]},
    amisId : { type : [mongoose.Schema.Types.ObjectId], required : false, validate : [ (amis : [ObjectId]) => { amis.forEach(validerMonstre); }, "Aucun monstre portant l'id fourni n'existe"]},
    dateNaissance : { type : Date, required :  [true, "La date de naissance du monstre est obligatoire"], validate : [ (dateNaissance : Date) => { return dateNaissance.getDate() <= Date.now(); }, "La date de naissance ne peut pas être supérieure à maintenant" ] },
    aventuriersVaincus : { type : [AventurierSchema], required : false }
})


function validerRace(id : ObjectId) {
    return true; // TODO remplacer avec le repo de la race
}

function validerMonstre(id : ObjectId) {
    return true; // TODO remplacer avec le repo de monstre
}

mongoose.pluralize(null);
export default model<IMonstre>("monstres", MonstreSchema);