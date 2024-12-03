import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Not, Repository } from "typeorm";
import { User } from "../../typeorm/entities/User";
import { Notification } from "../../typeorm/entities/Notification";
import { Post } from "../../typeorm/entities/Post";
import { Comment } from "../../typeorm/entities/Comment";
import { Emotion } from "src/typeorm/entities/Emotion";
import { PaginatedResponse } from "../pagination/pagination.interface";

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification) 
        private notificationRepository: Repository<Notification>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    //tạo thông báo khi có bình luận
    async createCommentNotification(post: Post, comment: Comment, currentUser: User): Promise<Notification> {
        // Kiểm tra xem post và post.author có tồn tại không
        if (!post || !post.authorId) {
            throw new Error('Post hoặc author không tồn tại');
        }
        const notification = new Notification();
        notification.receiver = post.authorId; //người nhận thông báo
        notification.post = post; //bài viết liên quan
        notification.comment = comment; //bình luận liên quan
        notification.sender = currentUser; //người gửi bình luận
        notification.message = `${currentUser.name} đã bình luận vào bài viết của bạn`;
        notification.isRead = false;

        //lưu thông báo vào cơ sở dữ liệu
        return await this.notificationRepository.save(notification);
    }

    //tạo thông báo khi có lượt bày tỏ cảm xúc
    async createEmotionNotification(post: Post, emotion: Emotion, currentUser: User): Promise<Notification> {
        // Kiểm tra xem post và post.author có tồn tại không
        if (!post || !post.authorId) {
            throw new Error('Post hoặc author không tồn tại');
        }
        const notification = new Notification();
        notification.receiver = post.authorId; //người nhận thông báo
        notification.post = post; //bài viết liên quan
        notification.emotion = emotion; //cảm xúc liên quan
        notification.sender = currentUser; //người gửi cảm xúc
        notification.message = `${currentUser.name} đã ${emotion.emotion} bài viết của bạn`;
        notification.isRead = false;

        //lưu thông báo vào cơ sở dữ liệu
        return await this.notificationRepository.save(notification);
    }

    //lấy tất cả thông báo của một người dùng
    async findAll(id: number, page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Notification>> {
        const [notifications, total] = await this.notificationRepository.findAndCount({
            where: { receiver: { idUser: id } },
            relations: ['sender', 'post', 'comment'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * pageSize,
            take: pageSize,
         });
         return {
            data: notifications,
            pagination: {
                total, 
                last_page: Math.ceil(total / pageSize), 
                pageSize, 
                page
            }
         };
    }

    //đánh dấu thông báo đã đọc
    async markNotificationAsRead(id: number): Promise<Notification> {
        const notification = await this.notificationRepository.findOne({ where: { id } });
        if (!notification) {
            throw new Error('Notification not found');
        }
        notification.isRead = true;
        return await this.notificationRepository.save(notification);
    }

    //xóa thông báo
    async deleteNotification(id: number): Promise<void> {
        const notification = await this.notificationRepository.findOne({ where: { id } });
        if (!notification) {
            throw new Error('Notification not found');
        }
        await this.notificationRepository.delete(id);
    }

    async createOrUpdateEmotionNotification(post: Post, emotion: Emotion, user: User) {
        //tìm thông báo có cùng post và emotion
        const existingNotification = await this.notificationRepository.findOne({
            where: {
                sender: { idUser: user.idUser },
                post: { idPost: post.idPost },
                receiver: { idUser: post.authorId.idUser },
                emotion: { idEmotion: Not(IsNull()) }
            },
        });

        if(existingNotification){
            //cập nhật thông báo
            const emotionType = emotion.emotion || 'removed';
            //tạo message tùy theo emotion
            const message = emotionType === 'removed' 
                ? `${user.name} đã bỏ cảm xúc khỏi bài viết của bạn` 
                : `${user.name} đã thả ${emotionType} vào bài viết của bạn`;
            
            //cập nhật notification trong cơ sở dữ liệu
            return await this.notificationRepository.save({
                ...existingNotification,
                message,
                emotion,
                isRead: false,
                updatedAt: new Date()
            });
        }else{
            //tạo thông báo mới nếu chưa tồn tại
            const notification = this.notificationRepository.create({
                sender: user,
                post,
                receiver: post.authorId,
                emotion,
                message: `${user.name} đã thả ${emotion.emotion} vào bài viết của bạn`,
                isRead: false
            });
            return await this.notificationRepository.save(notification);
        }
    }

    //tạo thông báo khi có lời mời kết bạn
    async createFriendRequestNotification(sender: User, receiver: User): Promise<Notification> {
        const notification = new Notification();
        notification.sender = sender;
        notification.receiver = receiver;
        notification.message = `${sender.name} đã gửi cho bạn lời mời kết bạn`;
        notification.isRead = false;

        return await this.notificationRepository.save(notification);
    }
}