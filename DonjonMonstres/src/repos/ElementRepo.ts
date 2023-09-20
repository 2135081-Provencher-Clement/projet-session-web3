import { IElement } from "@src/models/Element";
import Element from "@src/models/Element";
import { error } from "console";
import { ObjectId } from "mongoose";

async function persists(id: ObjectId) : Promise<Boolean> {
    const element = await Element.findById(id);
    return element !== null;
}

async function getIdParNom(nom: String) : Promise<ObjectId | undefined> {
    const element = await Element.findOne({nom : nom});
    if (element !== null) {
        return element._id;
    }
    return undefined;
}

async function getNomParId(id: ObjectId) : Promise<String | undefined> {
    const element = await Element.findById(id);
    if (element !== null) {
        return element.nom;
    }
    return undefined;
}

async function insert(element: IElement) : Promise<IElement> {
    const nouvelElement = new Element(element);
    nouvelElement.save();
    return nouvelElement
}

async function update(element: IElement) : Promise<IElement> {
    const elementPourModifier = await Element.findById(element._id);
    if (elementPourModifier === null) {
        throw new Error("Élément introuvable");
    }

    elementPourModifier.nom = element.nom;

    elementPourModifier.save();

    return elementPourModifier;
}

async function _delete(id: ObjectId) : Promise<void> {
    
    if (!await persists(id)) {
        throw new Error("Élément introuvable, suppression impossible")
    }

    // TODO supprimer tous les races avec cet élément

    await Element.findByIdAndDelete(id);
}

export default {
    persists,
    getIdParNom,
    getNomParId,
    insert,
    update,
    delete : _delete
}