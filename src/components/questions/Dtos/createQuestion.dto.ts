import { IsString, IsNotEmpty } from 'class-validator';

export class CreateQuestionDto {

    @IsNotEmpty()
    @IsString()
    question: string

    @IsNotEmpty()
    @IsString({each: true})
    choices: string[]

    @IsNotEmpty()
    @IsString({each: true})
    correctAnswers: string[]

}