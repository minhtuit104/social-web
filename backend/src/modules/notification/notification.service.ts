import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../typeorm/entities/User";
import { Notification } from "../../typeorm/entities/Notification";
import { Post } from "../../typeorm/entities/Post";
import { Comment } from "../../typeorm/entities/Comment";
import { Emotion } from "src/typeorm/entities/Emotion";

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
    async findAll(id: number): Promise<Notification[]> {
        return await this.notificationRepository.find({ 
            where: { receiver: { idUser: id } },
            relations: ['sender', 'post', 'comment'],
            order: { createdAt: 'DESC' },
         });
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
}