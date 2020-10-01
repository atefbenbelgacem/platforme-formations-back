import { IsNotEmpty, IsString, IsMongoId, IsDateString, IsObject } from "class-validator"

export class CreateEventDto {
  
    @IsNotEmpty()
    @IsString()
    title: string
    
    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @IsMongoId()
    presenter: string

    @IsNotEmpty()
    @IsDateString()
    date: Date

    @IsNotEmpty()
    @IsObject()
    duration: Object

}