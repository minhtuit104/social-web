import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Response, ParseIntPipe,} from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostDto } from "./dtos/create.dto";
import { UpdatePostDto } from "./dtos/update.dto";
import {JwtAuthGuard} from "../auth/jwtAuthGuard/jwtAuthGuard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Req } from "@nestjs/common";

@ApiBearerAuth()
@ApiTags('Posts')
@Controller('/api/v1/posts')
export class PostController{

    constructor(private postService: PostService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(@Response() res){
        const posts = await this.postService.findAll();
        return res.status(200).json({
            status: 'success',
            message: 'Posts retrieved successfully',
            data: posts,
          });
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
    async create(@Body() createPostDto: CreatePostDto, @Req() req: Request, @Response() res ){
        //lấy idUser từ accessToken trong request
        const user = req['user'];
        const authorId = user.idUser;
        const post =  await this.postService.create(createPostDto, authorId);
        return res.status(200).json({
            status: 'success',
            message: 'create post successfully',
            data: post,
          });
    }

    @Put('/:id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto){
        return this.postService.update(id, updatePostDto);
    }

    @Get('/user/:idUser')
    @UseGuards(JwtAuthGuard)
    async fetchPostByIdUser(@Param('idUser', ParseIntPipe) idUser: number, @Req() req: Request, @Response() res){
        const posts = await this.postService.fetchPostByIdUser(idUser);
        return res.status(200).json({
            status: 'success',
            message: 'Posts retrieved successfully',
            data: posts,
          });
    }
}