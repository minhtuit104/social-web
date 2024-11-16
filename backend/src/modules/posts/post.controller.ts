import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Response, ParseIntPipe, Query,} from "@nestjs/common";
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
    async findAll(
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('pageSize', ParseIntPipe) pageSize: number = 5,
        @Response() res
    ){
        const result = await this.postService.findAll(page, pageSize);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'SUCCESS',
            data: result
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
    async createPost(@Body() createPostDto: CreatePostDto, @Req() req: Request, @Response() res ){
        try{
            console.log("...check createPostDto:::", createPostDto);
            //lấy idUser từ accessToken trong request
            const user = req['user'];
            console.log("...check id user:::", user.idUser);
            const post =  await this.postService.create(createPostDto, user.idUser);
            return res.status(200).json({
                status: 'success',
                message: 'create post successfully',
                data: post,
            });
        } catch (error) {
            console.log("...check error:::", error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error>>>>>>?????',
                error: error.message
            });
        }
    }

    @Put('/:id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto){
        return this.postService.update(id, updatePostDto);
    }

    @Get('/user/:idUser')
    @UseGuards(JwtAuthGuard)
    async fetchPostByIdUser(
        @Param('idUser', ParseIntPipe) idUser: number, 
        @Req() req: Request, 
        @Response() res,
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('pageSize', ParseIntPipe) pageSize: number = 10
    ){
        const posts = await this.postService.fetchPostByIdUser(idUser, page, pageSize);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'SUCCESS',
            data: posts,
          });
    }
}