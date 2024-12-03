import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdatePostDto {
    // @IsNotEmpty({message: 'idPost không được để trống'})
    // idPost: number;
    @ApiProperty()
    title?: string;

    @ApiProperty()
    image?: string;

    @ApiProperty()
    @IsNotEmpty({message: 'privacy không được để trống'})
    privacy?: string;

    @ApiProperty()
    totalEmotion?: number;
    
    @ApiProperty()
    totalComment?: number;

}