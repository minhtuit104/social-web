import { Controller, Delete, Get, Param, Patch, Response } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserService } from "../users/user.service";


@ApiBearerAuth()
@ApiTags('Notifications')
@Controller('/api/v1/notifications')
export class NotificationController {
    
    constructor(
        private readonly notificationService: NotificationService,
        // private readonly userService: UserService
    ) {}

    //lấy tất cả thông báo của một người dùng
    @Get('/:id')
    // @UseGuards(JwtAuthGuard)
    async findAll(@Param('id') id: number, @Response() res){
        const notifications = await this.notificationService.findAll(id);
        return res.status(200).json({
            status: 'success',
            message: 'Notifications retrieved successfully',
            data: notifications,
          });
    }

    //đánh dấu thông báo đã đọc
    @Patch('/:id/read')
    async markAsRead(@Param('id') id: number){
        const notification = await this.notificationService.markNotificationAsRead(id);
        return { success: true, notification };
    }

    //xóa thông báo
    @Delete('/:id')
    async delete(@Param('id') id: number, @Response() res){
        const notification = await this.notificationService.deleteNotification(id);
        return res.status(200).json({
            status: 'success',
            message: 'Notification deleted successfully',
            data: notification,
          });
    }

}