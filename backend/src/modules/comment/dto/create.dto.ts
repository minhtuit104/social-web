import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateCommentDto {
    @ApiProperty()
    idPost: number;

    @ApiProperty()
    @IsNotEmpty({message: 'bạn chưa nhập comment'})
    comment: string;
}