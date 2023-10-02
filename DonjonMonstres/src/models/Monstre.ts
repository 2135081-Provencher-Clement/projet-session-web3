import mongoose, { Schema, model, ObjectId, Mongoose } from 'mongoose';
import RaceRepo from '@src/repos/RaceRepo';
import MonstreRepo from '@src/repos/MonstreRepo';

enum rangAventurier {
    Paysan = "paysan",
    Bourgeois = "bourgeois",
    Noble = "noble",
    Royal = "royal"
}

enum classeAventurier {
    Guerrier = "guérrier",
    Mage = "mage",
    Voleur = "voleur",
    Barde = "barde"
}

export interface IMonstre {
    _id : ObjectId;
    nom : String;
    raceId : String;
    niveau : Number;
    age : Number;
    amisId : [ObjectId];
    dateNaissance : Date;
    aventuriersVaincus : [
        {
            nom : String;
            niveau : Number;
            rang : rangAventurier;
            classe : classeAventurier;
        }
    ];
}

const AventurierSchema = new Schema({
    nom : { type : String, required : [true, "Le nom de l'aventurier est nécéssaire"] },
    niveau : { type : Number, required : [true, "Le niveau de l'aventurier est obligatoire"], validate : [ (niveau : Number) => { return niveau.valueOf() > 0 && niveau.valueOf() <= 30 }, "Le niveau d'un aventurier doit être compris entre 1 et 30" ] },
    rang : {type : rangAventurier, required : [true, "Le rang de l'aventurier est obligatoire (paysan, bourgeois, noble, royal)"], enum : [rangAventurier, "Les valeurs acceptées sont 'paysan', 'bourgeois', 'noble', 'royal'"]},
    classe : {type : classeAventurier, required : [true, "La classe de l'aventurier est obligatoire (guérrier, mage, voleur, barde)"], enum : [classeAventurier, "Les classes acceptés sont 'guérrier', 'mage', 'voleur', 'barde'"]}
})

const MonstreSchema = new Schema<IMonstre>({
    nom : { type : String, required : [true, "Le nom du monstre est nécéssaire"] },
    raceId : { type : mongoose.Schema.Types.ObjectId, required : [true, "L'id de la race est obligatoire"], validate : [ validerRace, "Aucune race portant cet id n'existe" ]},
    niveau : {type : Number, required : [true, "Le niveau du monstre est nécéssaire"]},
    age : { type : Number, required : [ true, "L'age du monstre est obligatoire" ], validate : [ (age : Number) => { return age.valueOf() > 0; }, "L'age ne peut pas être égal ou inférieur à 0"]},
    amisId : { type : [mongoose.Schema.Types.ObjectId], required : false, validate : [ (amis : [ObjectId]) => { amis.forEach(validerMonstre); }, "Aucun monstre portant l'id fourni n'existe"]},
    dateNaissance : { type : Date, required :  [true, "La date de naissance du monstre est obligatoire"], validate : [ (dateNaissance : Date) => { return dateNaissance.getDate() <= Date.now(); }, "La date de naissance ne peut pas être supérieure à maintenant" ] },
    aventuriersVaincus : { type : [AventurierSchema], required : false }
})


function validerRace(id : ObjectId) : Promise<Boolean> {
    return RaceRepo.persists(id);
}

function validerMonstre(id : ObjectId) : Promise<Boolean> {
    return MonstreRepo.persists(id);
}

mongoose.pluralize(null);
export default model<IMonstre>("monstres", MonstreSchema);