import { ApiProperty } from "@nestjs/swagger";

export class CreateEmotionDto{
    @ApiProperty()
    idPost: number;

    @ApiProperty()
    emotion: string;
}