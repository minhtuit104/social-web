import { Module } from "@nestjs/common";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment } from "src/typeorm/entities/Comment";
import { User } from "src/typeorm/entities/User";
import { Post } from "src/typeorm/entities/Post";
import { PostModule } from "../posts/post.module";
import { NotificationModule } from "../notification/notification.module";

@Module({
    imports: [TypeOrmModule.forFeature([Comment, User, Post]), PostModule, NotificationModule],
    controllers: [CommentController],
    providers: [CommentService],
    exports: [CommentService]
})

export class CommentModule {};