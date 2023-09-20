import mongoose, { Schema, model, ObjectId } from 'mongoose';

export interface IElement {
    _id : ObjectId;
    nom : String;
}

const ElementSchema = new Schema<IElement>({
    nom : {type : String, required : [true, "Le nom de l'élément est obligatoire"]}
})

mongoose.pluralize(null);
export default model<IElement>('elements', ElementSchema);