import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class UpdateUserDto {
    // @IsNotEmpty({message: 'idUser không được để trống'})
    // idUser: number;
    @ApiProperty()
    @IsNotEmpty({message: 'tên không được để trống'})
    name: string;

    @ApiProperty()
    @IsNotEmpty({message: 'email không được để trống'})
    @IsEmail({}, {message: 'email không đúng định dạng'})
    email: string;

    @ApiProperty()
    birthday: string;

    @ApiProperty()
    avarta: string;
}