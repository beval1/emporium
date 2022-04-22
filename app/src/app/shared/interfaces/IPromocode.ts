export interface IPromocode {
  uid: string,
  type: string, //category, subcategory or products based
  code: string,
  subjectIds: string[],
  subjectNames: string[],
  discountType: string,
  discountValue: number,
  status: string,
  sellerId: string,
}
