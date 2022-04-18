import { IAnswer } from "./IAnswer"

export interface IQuestion {
  question: string,
  reply: IAnswer,
  userId: string,
  userName: string,
}
