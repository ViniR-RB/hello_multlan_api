import UseCase from '@/core/interface/use_case';
import { Unit } from '@/core/types/unit';

export default interface IDeleteUserUseCase
  extends UseCase<DeleteUserParam, Unit> {}

export interface DeleteUserParam {
  targetUserId: number;
  requestingUserId: number;
}
