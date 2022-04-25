import { IProductQuantity } from "./IProductQuantity";

export interface IOrder {
  uid: string,
  status: string,
  products: IProductQuantity[],
  dateRegistered: Date,
  dateProcessed: Date,
}
