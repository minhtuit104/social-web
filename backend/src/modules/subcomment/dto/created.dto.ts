import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateSubCommentDto {
    @ApiProperty()
    idComment: number;

    @ApiProperty()
    @IsNotEmpty({message: 'bạn chưa nhập comment'})
    subcomment: string;
}