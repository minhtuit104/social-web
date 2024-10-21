import { forwardRef, Module } from "@nestjs/common";
import { MyGateway } from "./message.gateway";
import { MessagerModule } from "../messager/messager.module";
import { PostModule } from "../posts/post.module";
import { CommentModule } from "../comment/comment.module";
import { PostService } from "../posts/post.service";
import { CommentService } from "../comment/comment.service";
import { MessagerService } from "../messager/messager.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "src/typeorm/entities/Post";
import { User } from "src/typeorm/entities/User";
import { Comment } from "src/typeorm/entities/Comment";
import { Messager } from "src/typeorm/entities/Messager";
import { Notification } from "src/typeorm/entities/Notification";
import { NotificationService } from "../notification/notification.service";
import { NotificationModule } from "../notification/notification.module";
import { UserModule } from "../users/user.module";
import { UserService } from "../users/user.service";
@Module({
    imports: [
        forwardRef(() => MessagerModule),
        forwardRef(() => PostModule),
        forwardRef(() => CommentModule),
        forwardRef(() => NotificationModule),
        forwardRef(() => UserModule),
        TypeOrmModule.forFeature([Post, User]),
        TypeOrmModule.forFeature([Comment, User, Post]),
        TypeOrmModule.forFeature([Messager, User]),
        TypeOrmModule.forFeature([Notification, User]),
        TypeOrmModule.forFeature([User]),
    ],
    providers: [MyGateway, PostService, CommentService, MessagerService, NotificationService, UserService],
})
export class GatewayModule {}