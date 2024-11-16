import { Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards, Response, NotFoundException, Delete, Query } from "@nestjs/common";
import { FriendService } from "./friend.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwtAuthGuard/jwtAuthGuard";

@ApiBearerAuth()
@ApiTags('Friends')
@Controller('/api/v1/friends')
export class FriendController {
    constructor(private readonly friendService: FriendService) {}

    //Gửi lời mời kết bạn
    @Post('/send-request/:friendId')
    @UseGuards(JwtAuthGuard)
    async sendFriendRequest(@Param('friendId', ParseIntPipe) friendId: number, @Req() req: Request, @Response() res) {
        const user = req['user'];
        const sendFriendRequest = await this.friendService.sendFriendRequest(user.idUser, friendId);
        return res.status(200).json({
            status: 'success',
            message: 'Friend request sent successfully',
            data: sendFriendRequest,
        });
    }

    //Chấp nhận lời mời kết bạn
    @Post('/accept-request/:friendId')
    @UseGuards(JwtAuthGuard)
    async acceptFriendRequest(@Param('friendId', ParseIntPipe) friendId: number, @Req() req: Request, @Response() res) {
        const user = req['user'];
        const acceptFriendRequest = await this.friendService.acceptFriendRequest(user.idUser, friendId);
        return res.status(200).json({
            status: 'success',
            message: 'Friend request accepted successfully',
            data: acceptFriendRequest,
        });
    }

    //Từ chối lời mời kết bạn
    @Post('/reject-request/:friendId')
    @UseGuards(JwtAuthGuard)
    async rejectFriendRequest(@Param('friendId', ParseIntPipe) friendId: number, @Req() req: Request, @Response() res) {
        const user = req['user'];
        const rejectFriendRequest = await this.friendService.rejectFriendRequest(user.idUser, friendId);
        return res.status(200).json({
            status: 'success',
            message: 'Friend request rejected successfully',
            data: rejectFriendRequest,
        });
    }

    //Hủy lời mời kết bạn
    @Post('/cancel-request/:friendId')
    @UseGuards(JwtAuthGuard)
    async cancelFriendRequest(@Param('friendId', ParseIntPipe) friendId: number, @Req() req: Request, @Response() res) {
        const user = req['user'];
        const cancelFriendRequest = await this.friendService.CancelFriendRequest(user.idUser, friendId);
        return res.status(200).json({
            status: 'success',
            message: 'Friend request canceled successfully',
            data: cancelFriendRequest,
        });
    }

    //Lấy danh sách bạn bè
    @Get('/friend-list')
    @UseGuards(JwtAuthGuard)
    async getFriendList(
        @Req() req: Request, 
        @Response() res,
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('pageSize', ParseIntPipe) pageSize: number = 10
    ) {
        const user = req['user'];
        const friendList = await this.friendService.getFriendList(user.idUser, page, pageSize);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'SUCCESS',
            data: friendList,
        });
    }

    //Lấy danh sách lời mời kết bạn
    @Get('/friend-request')
    @UseGuards(JwtAuthGuard)
    async getFriendRequest(
        @Req() req: Request, 
        @Response() res,
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('pageSize', ParseIntPipe) pageSize: number = 10
    ) {
        const user = req['user'];
        const friendRequest = await this.friendService.getFriendRequest(user.idUser, page, pageSize);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'SUCCESS',
            data: friendRequest,
        });
    }

    //Lấy danh sách lời mời kết bạn đã gửi
    @Get('/friend-request-sent')
    @UseGuards(JwtAuthGuard)
    async getFriendRequestSent(
        @Req() req: Request, 
        @Response() res,
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('pageSize', ParseIntPipe) pageSize: number = 10
    ) {
        const user = req['user'];
        const friendRequestSent = await this.friendService.getFriendRequestSent(user.idUser, page, pageSize);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'SUCCESS',
            data: friendRequestSent,
        });
    }

    //Kiểm tra trạng thái bạn bè
    @Get('/check-status/:friendId')
    @UseGuards(JwtAuthGuard)
    async checkFriendship(@Param('friendId', ParseIntPipe) friendId: number, @Req() req: Request, @Response() res) {
        const user = req['user'];
        const status = await this.friendService.checkFriendshipStatus(user.idUser, friendId);
        return res.status(200).json({
            status: 'success',
            message: 'Friendship status retrieved successfully',
            data: status,
        });
    }

    //Xóa bạn bè
    @Delete('/delete/:friendId')
    @UseGuards(JwtAuthGuard)
    async deleteFriend(
        @Param('friendId', ParseIntPipe) friendId: number, 
        @Req() req: Request, 
        @Response() res
    ) {
        try {
            const user = req['user'];
            await this.friendService.deleteFriend(user.idUser, friendId);
            return res.status(200).json({
                status: 'success',
                message: 'Delete friendship successfully',
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                return res.status(404).json({
                    status: 'error',
                    message: error.message,
                });
            }
            return res.status(500).json({
                status: 'error',
                message: 'An error occurred while deleting friendship',
            });
        }
    }

    //Check xem lời mời kết bạn có tồn tại trong database hay không
    @Get('/check-friend-request/:friendId')
    @UseGuards(JwtAuthGuard)
    async checkFriendRequest(@Param('friendId', ParseIntPipe) friendId: number, @Req() req: Request, @Response() res) {
        try {
            const user = req['user'];
            const isValid = await this.friendService.checkRequestExists(user.idUser, friendId);
            return res.status(200).json({
                status: 'success',
                data: isValid,
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: 'Lỗi khi kiểm tra lời mời kết bạn',
            });
        }
    }
}