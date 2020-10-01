import { IsNotEmpty, IsMongoId, IsNumber, ValidateNested } from 'class-validator';
import { quizzAnswer } from 'src/models/quizzResult.schema';

export class CreateResultDto {

    @IsNotEmpty()
    @IsMongoId()
    user: string

    @IsNotEmpty()
    @IsMongoId()
    session: string

    @IsNotEmpty()
    @ValidateNested()
    quizzAnswers: quizzAnswer[]

    @IsNumber()
    score: number

}