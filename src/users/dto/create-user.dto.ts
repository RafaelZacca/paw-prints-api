import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly sub: string;

  readonly image: string | undefined;
}
