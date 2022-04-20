import { IReview } from "./IReview"
import { IQuestion } from "./IQuestion"
import { IProductSpecification } from "./IProductSpecification"

export interface IProduct {
  uid: string,
  name: string,
  desc?: string,
  price: number,
  rating?: number,
  images?: string[],
  reviews?: IReview[],
  questions?: IQuestion[]
  specifications?: IProductSpecification[],
  categoryId: string,
  // categoryName: string,
  subcategoryId: string,
  // subcategoryName: string,
  sellerId: string,
  status: string,
  quantity: Number,
}
