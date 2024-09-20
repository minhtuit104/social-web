import { Column, Entity, OneToMany, OneToOne, BeforeInsert, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./Account";
import { Post } from "./Post";

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

}