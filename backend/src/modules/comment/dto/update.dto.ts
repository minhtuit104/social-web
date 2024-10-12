import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateCommentDto{
    @ApiProperty()
    @IsNotEmpty({message: 'hãy nhập comment'})
    comment: string
}