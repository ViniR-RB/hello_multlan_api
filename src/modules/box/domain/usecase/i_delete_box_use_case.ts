import UseCase from "@/core/interface/use_case";
import { Unit } from "@/core/types/unit";

export default interface IDeleteBoxUseCase extends UseCase<DeleteBoxUseParam,Unit> {}



export interface DeleteBoxUseParam {
    boxId: string;
    userActionId: number;
}



