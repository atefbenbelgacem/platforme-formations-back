import { IsNotEmpty, IsInt, ValidateNested} from "class-validator"
import { CreateEventDto } from "./createEvent.dto";
import { User } from "src/models/user.schema";

export class CreatePizzaUDto extends CreateEventDto {
  
    @IsNotEmpty()
    @IsInt()
    placesLeft: number

    @ValidateNested()
    subscribers: User[]

    @ValidateNested()
    waitingList: User[]
}