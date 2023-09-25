import mongoose, { Schema, model, ObjectId } from 'mongoose';

export interface IElement {
    _id : ObjectId;
    nom : String;
}

// TODO handle l'erreur possible si un nom déjà existant est entrée (code : 11000)
const ElementSchema = new Schema<IElement>({
    nom : {type : String, required : [true, "Le nom de l'élément est obligatoire"], unique : true}
})

mongoose.pluralize(null);
export default model<IElement>('elements', ElementSchema);