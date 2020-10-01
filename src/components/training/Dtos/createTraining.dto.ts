import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Session } from 'src/models/session.schema';
import { User } from 'src/models/user.schema';

export class CreateTrainingDto {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsString()
    subject: string

    @IsNotEmpty()
    @IsString()
    teacher: string

    @IsNotEmpty()
    @ValidateNested()
    students: User[]

    sessions: Session[]

}