import { IsString, IsNotEmpty, IsObject, IsDateString, ValidateNested } from 'class-validator';
import { Question } from 'src/models/question.schema';

export class CreateSessionDto {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsDateString()
    date: Date

    @IsNotEmpty()
    @IsObject()
    duration: Object

    @ValidateNested()
    documents: Document[]

    @ValidateNested()
    quizz: Question[]

}