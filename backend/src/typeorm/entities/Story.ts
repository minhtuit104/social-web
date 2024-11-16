import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Story {
    @PrimaryGeneratedColumn()
    idStory: number;

    @Column('text', { nullable: true })
    image: string;

    @Column({type: 'enum', enum: ['image', 'video'], default: 'image'})
    fileType: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({default: true})
    isActive: boolean;

    @ManyToOne(() => User, (user) => user.stories)
    @JoinColumn({name: 'authorId'})
    authorId: User;
}