import { IsNotEmpty, ValidateNested } from "class-validator"
import { CreateQuestionDto } from "./createQuestion.dto"


export class CreateQuestionsDto {

    @IsNotEmpty()
    @ValidateNested()
    questions: CreateQuestionDto[]
}