import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { StoryService } from "./story.service";
import { JwtAuthGuard } from "../auth/jwtAuthGuard/jwtAuthGuard";
import { CreateStoryDto } from "./dto/create.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags('Stories')
@Controller('api/v1/stories')
export class StoryController {
    constructor(private readonly storyService: StoryService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async createStory(@Body() createStoryDto: CreateStoryDto, @Req() req: Request) {
        try {
            const user = req['user'];
            const story = await this.storyService.createStory(createStoryDto, user.idUser);
            return {
                status: 'success',
                message: 'Story created successfully',
                data: story
            };
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            };
        }
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll() {
        try {
            const stories = await this.storyService.findAll();
            return {
                status: 'success',
                data: stories
            };
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            };
        }
    }

    @Get('/:id')
    @UseGuards(JwtAuthGuard)
    async findOneByUserId(@Param('id') userId: number) {
        try {
            const stories = await this.storyService.findOneByUserId(userId);
            return {
                status: 'success',
                data: stories
            };
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            };
        }
    }
}