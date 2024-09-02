import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateAccountDto {

    @ApiProperty()
    @IsNotEmpty({message: 'idAccount không được để trống'})
    idAccount: number;

    @ApiProperty()
    @IsNotEmpty({message: 'idUser không được để trống'})
    idUser: number;

    @ApiProperty()
    @IsNotEmpty({message: 'email không được để trống'})
    @IsEmail({}, {message: 'email không đúng định dạng'})
    email: string;

    @ApiProperty()
    @IsNotEmpty({message: 'password không được để trống'})
    password: string;

    @ApiProperty()
    refreshToken: string;
    @ApiProperty()
    role: number;
}