import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { User } from "./User";

@Entity({name: 'post'})
export class Post{
    @PrimaryGeneratedColumn({type: 'int'})
    idPost: number;
    
    @ManyToOne(() => User, user => user.posts, { nullable: false })
    @JoinColumn({ name: 'author'})
    authorId: User;

    @Column({type: 'int'})
    author: number;

    @Column({type: 'varchar', length: 500})
    title: string;

    @Column({type: 'varchar', length: 200})
    image: string;

    @Column({type: 'varchar', length: 200})
    privacy: string;

    @Column({type: 'int'})
    totalEmotion: number;

    @Column({type: 'int'})
    totalComment: number;


}