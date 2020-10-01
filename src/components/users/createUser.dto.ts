import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsEmail,
  IsMongoId,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsMongoId()
  pole: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['Colab', 'Admin', 'Manager'])
  roleName: string;
}
