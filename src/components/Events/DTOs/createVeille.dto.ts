import { IsNotEmpty, IsMongoId} from "class-validator"
import { CreateEventDto } from "./createEvent.dto";

export class CreateVeilleDto extends CreateEventDto {
  
    @IsNotEmpty()
    @IsMongoId()
    pole: string
    
}