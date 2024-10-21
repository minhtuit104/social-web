import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { Post } from "src/typeorm/entities/Post";
import { User } from "src/typeorm/entities/User";

@Module({
    imports: [TypeOrmModule.forFeature([Post, User])],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService]
})

export class PostModule{}