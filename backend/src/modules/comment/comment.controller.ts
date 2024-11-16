import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query, Req, Response, UseGuards } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { UpdateCommentDto } from "./dto/update.dto";
import { JwtAuthGuard } from "../auth/jwtAuthGuard/jwtAuthGuard";
import { CreateCommentDto } from "./dto/create.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { NotificationService } from "../notification/notification.service";
import { PostService } from "../posts/post.service";


@ApiBearerAuth()
@ApiTags('Comments')
@Controller('/api/v1/comments')
export class CommentController {

    constructor(
        private readonly commentService: CommentService,
        private readonly notificationService: NotificationService,
        private readonly postService: PostService,
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(
        @Response() res,
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('pageSize', ParseIntPipe) pageSize: number = 10
    ){
        const comments = await this.commentService.findAll(page, pageSize);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'SUCCESS',
            data: comments,
          });
    }

    // @Get('/:id')
    // @UseGuards(JwtAuthGuard)
    // findOne(@Param('id') id: number){
    //     return this.commentService.findOne(id);
    // }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createdComment(@Body() createCommentDto: CreateCommentDto, @Req() req: Request, @Response() res){
        //lấy idUser từ token khi gửi request
        const user = req['user'];
        const idUser = user.idUser;
        const comment = await this.commentService.createdComment(createCommentDto, idUser);

        //lấy post từ comment
        const post = await this.postService.findOne(comment.post.idPost);
        
        if (!post) {
            throw new NotFoundException('Không tìm thấy bài viết');
        }

        //tạo thông báo khi có bình luận
        await this.notificationService.createCommentNotification(post, comment, user);


        return res.status(200).json({
            status: 'success',
            message: 'create comment successfully',
            data: comment,
          });
    }

    @Put('/:id')
    @UseGuards(JwtAuthGuard)
    updateComment(@Param('id') id: number, @Body() updateCommentDto: UpdateCommentDto){
        return this.commentService.updateComment(id, updateCommentDto);
    }

    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    removeComment(@Param('id') id: number ){
        return this.commentService.removeComment(id);
    }

    @Get('/:idPost')
    @UseGuards(JwtAuthGuard)
    async getCommentsByPost(
        @Param('idPost') idPost: number,
        @Query('page', ParseIntPipe) page: number = 1,  
        @Query('pageSize', ParseIntPipe) pageSize: number = 2,
        @Response() res
    ){
        const result = await this.commentService.getCommentsByPost(idPost, page, pageSize);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'SUCCESS',
            data: result
          });
    }
}