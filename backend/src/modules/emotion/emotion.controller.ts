import { Body, Controller, Post, Req, UseGuards, Response, NotFoundException, Param, Delete, Get } from "@nestjs/common";
import { EmotionService } from "./emotion.service";
import { JwtAuthGuard } from "../auth/jwtAuthGuard/jwtAuthGuard";
import { CreateEmotionDto } from "./dto/create.dto";
import { PostService } from "../posts/post.service";
import { NotificationService } from "../notification/notification.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags('Emotions')
@Controller('/api/v1/emotions')
export class EmotionController{
    constructor(
        private readonly emotionService: EmotionService,
        private readonly postService: PostService,
        private readonly notificationService: NotificationService,
    ){}

    // thêm hoặc cập nhật emotion
    @Post()
    @UseGuards(JwtAuthGuard)
    async addOrUpdateEmotion(@Body() createEmotionDto: CreateEmotionDto, @Req() req: Request, @Response() res){
        const user = req['user'];
        const idUser = user.idUser;
        const emotion = await this.emotionService.addOrUpdateEmotion(createEmotionDto, idUser);
        
        //lấy post từ emotion
        const post = await this.postService.findOne(emotion.post.idPost);

        if(!post){
            throw new NotFoundException('Không tìm thấy bài viết');
        }

        //tạo thông báo khi có cảm xúc
        await this.notificationService.createEmotionNotification(post, emotion, user);

        return res.status(200).json({
            status: 'success',
            message: 'create emotion successfully',
            data: emotion,
          });
    }

    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    removeEmotion(@Param('id') id: number){
        return this.emotionService.deleteEmotion(id);
    }

    @Get('/:idPost')
    @UseGuards(JwtAuthGuard)
    getEmotionsByPost(@Param('idPost') idPost: number){
        return this.emotionService.getEmotionsByPost(idPost);
    }
}