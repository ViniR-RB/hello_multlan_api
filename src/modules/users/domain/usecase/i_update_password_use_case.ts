import UseCase from '@/core/interface/use_case';
import { Unit } from '@/core/types/unit';

export default interface IUpdatePasswordUseCase
  extends UseCase<UpdateMyPasswordParam, Unit> {}

export interface UpdateMyPasswordParam {
  userAction: number;
  userChangePassword: number;
  oldPassword: string;
  newPassword: string;
}
