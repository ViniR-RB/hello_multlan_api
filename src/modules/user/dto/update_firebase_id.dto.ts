import { IsNotEmpty, IsString } from 'class-validator';

export default class UpdateFirebaseIdDto {
  @IsNotEmpty()
  @IsString()
  firebaseId: string;
}
