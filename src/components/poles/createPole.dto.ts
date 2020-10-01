import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class CreatePoleDto {
  
    @IsNotEmpty()
    @IsString()
    @IsIn(['ESS', 'Mobile', 'E-Business', 'Labs'])
    name: string

}