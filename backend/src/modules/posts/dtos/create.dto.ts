import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreatePostDto {
    @ApiProperty()
    @IsNotEmpty({message: 'idPost không được để trống'})
    idPost: number;

    @ApiProperty()
    @IsNotEmpty({message: 'title không được để trống'})
    title: string;

    @ApiProperty()
    @IsNotEmpty({message: 'author không được để trống'})
    author: number;

    @ApiProperty()
    image: string;

    @ApiProperty()
    @IsNotEmpty({message: 'privacy không được để trống'})
    privacy: string;

    @ApiProperty()
    totalEmotion: number;
    
    @ApiProperty()
    totalComment: number;

}