import { IAddress } from "./IAddress";
import { IProduct } from "./IProduct";
import { IProductQuantity } from "./IProductQuantity";

export interface IUser {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string | null;
    emailVerified: boolean;
    phoneNumber: string;
    userRole: string;
    status: string;
    addresses: IAddress[];
    favourites: IProduct[];
    cart: IProductQuantity[];
}
