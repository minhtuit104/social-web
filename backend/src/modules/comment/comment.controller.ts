import { Body, Controller, Delete, Get, Param, Post, Put, Req, Response, UseGuards } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { UpdateCommentDto } from "./dto/update.dto";
import { JwtAuthGuard } from "../auth/jwtAuthGuard/jwtAuthGuard";
import { CreateCommentDto } from "./dto/create.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";


@ApiBearerAuth()
@ApiTags('Comments')
@Controller('api/v1/comments')
export class CommentController {

    constructor(private readonly commentService: CommentService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(@Response() res){
        const comments = await this.commentService.findAll();
        return res.status(200).json({
            status: 'success',
            message: 'Comments retrieved successfully',
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
    getCommentsByPost(@Param('idPost') idPost: number){
        return this.commentService.getCommentsByPost(idPost);
    }
}