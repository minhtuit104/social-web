import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";


@Entity({name: 'subcomment'})
export class SubComment{
    @PrimaryGeneratedColumn({type: 'int'})
    idSubcomment: number;

    @ManyToOne(() => Comment, comment => comment.subComments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idComment' })
    comment: Comment;

    @ManyToOne(() => User, user => user.subComments, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'idUser'})
    user: User;

    @Column('text')
    subcomment: string;

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date;
}