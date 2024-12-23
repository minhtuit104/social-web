import { Controller, Post, Body, UseGuards, Req, Get, Param, Response } from '@nestjs/common';
import { SavedPostService } from './savePost.service';
import { JwtAuthGuard } from '../auth/jwtAuthGuard/jwtAuthGuard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiBearerAuth()
@ApiTags('Saved Posts')
@Controller('api/v1/saved-posts')
@UseGuards(JwtAuthGuard)
export class SavedPostController {
    constructor(private savedPostService: SavedPostService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAllSavedPost(@Req() req, @Response() res) {
        const userId = req.user.idUser;
        const savedPosts = await this.savedPostService.getSavedPost(userId);
        return res.status(200).json({
            status: 'success',
            message: 'get all saved post successfully',
            data: savedPosts
        });
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async savePost(@Body() body: { postId: number }, @Req() req, @Response() res) {
        try{
            const userId = req.user.idUser;
            const result = await this.savedPostService.savePost(userId, body.postId);
            return res.status(200).json({
                status: 'success',
                message: 'save post successfully',
                data: result
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: 'save post failed',
                data: error
            });
        }
    }

    @Get(':postId')
    @UseGuards(JwtAuthGuard)
    async checkIfSaved(@Param('postId') postId: number, @Req() req) {
        const userId = req.user.idUser;
        return this.savedPostService.checkIfPostIsSaved(userId, postId);
    }

    @Post('check-multiple')
    async checkMultiplePosts(@Body() body: { postIds: number[] }, @Req() req, @Response() res) {
        try{
            const userId = req.user.idUser;
            const results = await this.savedPostService.checkMultiplePosts(userId, body.postIds);
            return res.status(200).json({
                status: 'success',
                message: 'check multiple posts successfully',
                data: results
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: 'check multiple posts failed',
                data: error
            });
        }
}

}