import { ISubcategory } from "./ISubcategory";

export interface ICategory {
    uid: string,
    name: string,
    subcategories: string[],
    picture: string | null,
}