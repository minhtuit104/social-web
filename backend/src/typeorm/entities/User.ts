import { Column, Entity, OneToMany, OneToOne, BeforeInsert, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./Account";
import { Post } from "./Post";
import { Comment } from "./Comment";
import { SubComment } from "./SubComment";
import { Messager } from "./Messager";
import { Notification } from "./Notification";
import { Emotion } from "./Emotion";
//tên bảng
@Entity({ name: 'user'})
export class User {
    //định nghĩa các tường có trong bảng

    @PrimaryGeneratedColumn({type: 'int'})
    idUser: number;

    @Column({type: 'varchar', length: 200})
    name: string;

    @Column({type: 'varchar', length: 200, unique: true})
    email: string;

    @Column({nullable: true, type: 'varchar'})
    birthday: string;

    @Column({type: 'varchar', length: 200, default: null})
    avarta: string;

    @Column({nullable: true, type: 'datetime'})
    active: Date;
    
    @BeforeInsert()
    setActiveDate() {
    this.active = new Date();  // Set giá trị thời điểm hiện tại cho trường active
  }

    @OneToOne(() => Account, account => account.user)
    accounts: Account[];

    @OneToMany(() => Post, post => post.authorId)
    posts: Post[];

    @OneToMany(() => Comment, comment => comment.user)
    comments: Comment[];

    @OneToMany(() => Emotion, emotion => emotion.user)
    emotions: Emotion[];

    @OneToMany(() => SubComment, subcomment  => subcomment .user)
    subComments: SubComment[];

    @OneToMany(() => Messager, (messager) => messager.sender)
    sentMessagers: Messager[];

    @OneToMany(() => Messager, (messager) => messager.receiver)
    receivedMessagers: Messager[];

    @OneToMany(() => Notification, (notification) => notification.receiver)
    notifications: Notification[];
}