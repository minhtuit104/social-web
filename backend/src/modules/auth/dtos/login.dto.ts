import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginDto{
    @ApiProperty()
    @IsNotEmpty({message: 'Email không được để trống.'})
    email: string;

    @ApiProperty()
    @IsNotEmpty({message: 'Mật khẩu không được để trống.'})
    password: string;

}