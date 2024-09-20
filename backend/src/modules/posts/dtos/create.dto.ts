import { ApiProperty } from "@nestjs/swagger";
import {  IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePostDto {

    @ApiProperty()
    title: string;

    @ApiProperty()
    author: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    image: string;

    @ApiProperty()
    @IsNotEmpty({message: 'privacy không được để trống'})
    privacy: string;

    @ApiProperty()
    totalEmotion: number;
    
    @ApiProperty()
    totalComment: number;

}