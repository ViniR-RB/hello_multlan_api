import { Either } from '../either/either';

export type AsyncResult<L, R> = Promise<Either<L, R>>;
