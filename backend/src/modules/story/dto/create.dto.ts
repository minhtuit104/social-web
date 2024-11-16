import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateStoryDto {
    @ApiProperty()
    @IsString()
    image: string;

    @ApiProperty()
    @IsEnum(['image', 'video'])
    @IsOptional()
    fileType?: string;
}