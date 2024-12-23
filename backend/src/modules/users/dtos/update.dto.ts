import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class UpdateUserDto {
    // @IsNotEmpty({message: 'idUser không được để trống'})
    // idUser: number;
    @ApiProperty({required: false})
    name?: string;

    @ApiProperty({required: false})
    email?: string;

    @ApiProperty({required: false})
    birthday?: string;

    @ApiProperty({required: false})
    avarta?: string;
}