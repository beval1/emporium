import { SpecificationType } from "../enums/SpecificationTypeEnum";

export interface ISpecification {
  uid: string;
  name: string;
  parentSubcategory: string;
  type: SpecificationType,
  minTextSize?: Number,
  maxTextSize?: Number,
  minNumber?: Number,
  maxNumber?: Number,
}
