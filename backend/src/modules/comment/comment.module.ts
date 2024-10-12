import { Module } from "@nestjs/common";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment } from "src/typeorm/entities/Comment";
import { User } from "src/typeorm/entities/User";
import { Post } from "src/typeorm/entities/Post";

@Module({
    imports: [TypeOrmModule.forFeature([Comment, User, Post])],
    controllers: [CommentController],
    providers: [CommentService],
})

export class CommentModule {};