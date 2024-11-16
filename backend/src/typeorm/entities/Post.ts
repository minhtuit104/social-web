import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";
import { Emotion } from "./Emotion";

@Entity({name: 'post'})
export class Post{
    @PrimaryGeneratedColumn({type: 'int'})
    idPost: number;
    
    @ManyToOne(() => User, user => user.posts, { nullable: false })
    @JoinColumn({ name: 'authorId'})
    authorId: User;

    @Column({type: 'varchar', length: 5000})
    title: string;

    @Column({type: 'text', nullable: true })
    image: string;

    @Column({type: 'varchar', length: 200})
    privacy: string;

    @OneToMany(() => Comment, comment => comment.post)
    comments: Comment[];

    @OneToMany(() => Emotion, emotion => emotion.post)
    emotions: Emotion[];

    @Column({type: 'int', default: 0})
    totalEmotion: number;

    @Column({type: 'int', default: 0})
    totalComment: number;

    @CreateDateColumn({type: 'timestamp'})
    createAt: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updateAt: Date;

}