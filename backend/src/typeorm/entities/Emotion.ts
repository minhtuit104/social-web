import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

@Entity({name: 'emotion'})
export class Emotion{
    @PrimaryGeneratedColumn({type: 'int'})
    idEmotion: number;

    @ManyToOne(() => User, user => user.emotions, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'idUser'})
    user: User;

    @ManyToOne(() => Post, post => post.emotions, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'idPost'})
    post: Post;

    @Column({type: 'enum', enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry']})
    emotion: string;

    @CreateDateColumn({type: 'timestamp'})
    createAt: Date;
}
