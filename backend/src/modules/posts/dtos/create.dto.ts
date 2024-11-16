import { ApiProperty } from "@nestjs/swagger";
import {  IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePostDto {

    @ApiProperty()
    title?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    image?: string;

    @ApiProperty()
    privacy: string;

}