import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

@Entity('friends')
export class Friend {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user)=> user.sentFriendRequests, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_Id'})
    user: User;

    @ManyToOne(() => User, (user)=> user.receivedFriendRequests, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'friend_Id'})
    friend: User;

    @Column({type: 'enum', enum: ['pending', 'accepted', 'rejected'], default: 'pending'})
    status: string;

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date;
}