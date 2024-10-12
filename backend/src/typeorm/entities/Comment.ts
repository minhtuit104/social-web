import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { SubComment } from "./SubComment";
import { Post } from "./Post";



@Entity({ name: 'comment'})
export class Comment {
    @PrimaryGeneratedColumn({type: 'int'})
    idComment: number;

    @ManyToOne(() => User, user => user.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idUser'})
    user: User;

    @ManyToOne(() => Post, post => post.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idPost' })
    post: Post;

    @Column('text')
    comment: string;
    
    @OneToMany(() => SubComment, subcomment => subcomment.comment, { cascade: true })
    subComments: SubComment[];

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date;
}