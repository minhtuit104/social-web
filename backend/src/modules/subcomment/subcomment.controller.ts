import { Body, Controller, Delete, Get, Param, Post, Put, Req, Response, UseGuards } from "@nestjs/common";
import { SubCommentService } from "./subcomment.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwtAuthGuard/jwtAuthGuard";
import { UpdateSubCommentDto } from "./dto/update.dto";
import { CreateSubCommentDto } from "./dto/created.dto";


@ApiBearerAuth()
@ApiTags('SubComments')
@Controller('api/v1/subcomments')
export class SubCommentController{

    constructor(private readonly subcommentService: SubCommentService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(@Response() res){
        const subcomments = await this.subcommentService.findAll();
        return res.status(200).json({
            status: 'success',
            message: 'Subcomments retrieved successfully',
            data: subcomments,
          });
    }

    // @Get('/:id')
    // @UseGuards(JwtAuthGuard)
    // findOne(@Param('id') id: number){
    //     return this.subcommentService.findOne(id);
    // }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createdComment(@Body() createSubcommentDto: CreateSubCommentDto, @Req() req: Request, @Response() res ){
        const user = req['user'];
        const idUser = user.idUser;
        const subcomment = await this.subcommentService.createdSubComment(createSubcommentDto, idUser);
        return res.status(200).json({
            status: 'success',
            message: 'create Subcomment successfully',
            data: subcomment,
          });
    }

    @Put('/:id')
    @UseGuards(JwtAuthGuard)
    updateComment(@Param('id') id: number, @Body() updateSubcommentDto: UpdateSubCommentDto){
        return this.subcommentService.updateSubComment(id, updateSubcommentDto);
    }

    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    removeComment(@Param('id') id: number){
        return this.subcommentService.removeSubComment(id);
    }

    @Get('/:idComment')
    @UseGuards(JwtAuthGuard)
    getSubcommentsByComment(@Param('idComment') idComment: number){
        return this.subcommentService.getSubcommentsByComment(idComment);
    }
}