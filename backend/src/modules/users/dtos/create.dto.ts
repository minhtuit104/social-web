import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    // @ApiProperty()
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

    @ApiProperty()
    password: string;

    @ApiProperty()
    active: Date;
}