import UseCase from '@/core/interface/use_case';
import { Unit } from '@/core/types/unit';

export default interface IUpdateMyPasswordUseCase
  extends UseCase<UpdateMyPasswordParam, Unit> {}

export interface UpdateMyPasswordParam {
  userId: number;
  oldPassword: string;
  newPassword: string;
}
