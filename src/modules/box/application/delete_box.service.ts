import AppException from "@/core/exceptions/app_exception";
import ServiceException from "@/core/exceptions/service.exception";
import AsyncResult from "@/core/types/async_result";
import { left, right } from "@/core/types/either";
import { unit, Unit } from "@/core/types/unit";
import IBoxRepository from "@/modules/box/adapters/i_box_repository";
import IDeleteBoxUseCase, { DeleteBoxUseParam } from "@/modules/box/domain/usecase/i_delete_box_use_case";
import IUserRepository from "@/modules/users/adapters/i_user.repository";
import UserRole from "@/modules/users/domain/entities/user_role";

export default class DeleteBoxService implements IDeleteBoxUseCase {
    constructor(
            private readonly userRepository: IUserRepository,
            private readonly boxRepository: IBoxRepository
        ) {}
    
    async execute(param: DeleteBoxUseParam): AsyncResult<AppException, Unit> {
        const userFinder = await this.userRepository.findOne({
            userId: param.userActionId
        })

        if (userFinder.isLeft()) {
            return left(new ServiceException("User has not deleted the box", 400))
        }
        if (userFinder.value.role !== UserRole.ADMIN) {
          throw new ServiceException("User not allowed to delete box", 403)
        }
       
        const resultDeleteBox = await this.boxRepository.deleteById(param.boxId)
        if (resultDeleteBox.isLeft()) {
            return left(resultDeleteBox.value)
        }

        return right(unit)

    }
}