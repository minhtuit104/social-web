import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";
import { Comment } from "./Comment";
import { Emotion } from "./Emotion";
@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    //người nhận thông báo
    @ManyToOne(() => User, (user) => user.notifications)
    receiver: User;

    //người gửi thông báo
    @ManyToOne(() => User)
    sender: User;

    //nếu thông báo liên quan đến bài viết
    @ManyToOne(() => Post, {nullable: true, onDelete: 'CASCADE'})
    post: Post;

    //nếu thông báo liên quan đến bình luận
    @ManyToOne(() => Comment, {nullable: true, onDelete: 'CASCADE'})
    comment: Comment;

    //nếu thông báo liên quan đến cảm xúc
    @ManyToOne(() => Emotion, {nullable: true, onDelete: 'CASCADE'})
    emotion: Emotion;
    
    //nội dung thông báo
    @Column('text')
    message: string;

    //thời gian tạo thông báo
    @CreateDateColumn()
    createdAt: Date;

    //trạng thái thông báo
    @Column({default: false})
    isRead: boolean;
}
