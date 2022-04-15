import { SpecificationType } from "../enums/SpecificationTypeEnum";

export interface ISpecification {
  uid: string;
  name: string;
  parentSubcategory: string;
  type: string,
  minTextSize: Number | null,
  maxTextSize: Number | null,
  minNumber: Number | null,
  maxNumber: Number | null,
}
