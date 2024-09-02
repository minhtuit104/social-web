import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostDto } from "./dtos/create.dto";
import { UpdatePostDto } from "./dtos/update.dto";
import {JwtAuthGuard} from "../auth/jwtAuthGuard/jwtAuthGuard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags('Posts')
@Controller('/api/v1/posts')
export class PostController{

    constructor(private postService: PostService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(){
        return this.postService.findAll();
    }

    @Get('/:id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id') id: number){
        return this.postService.findOne(id);
    }

    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: number){
        return this.postService.remove(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createPostDto: CreatePostDto){
        return this.postService.create(createPostDto);
    }

    @Put('/:id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto){
        return this.postService.update(id, updatePostDto);
    }
}