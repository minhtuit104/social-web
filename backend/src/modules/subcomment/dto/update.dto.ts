import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateSubCommentDto{
    @ApiProperty()
    @IsNotEmpty({message: 'hãy nhập comment'})
    subcomment: string
}