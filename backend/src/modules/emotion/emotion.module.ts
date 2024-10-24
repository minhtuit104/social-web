import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Emotion } from "src/typeorm/entities/Emotion";
import { EmotionController } from "./emotion.controller";
import { EmotionService } from "./emotion.service";
import { User } from "src/typeorm/entities/User";
import { Post } from "src/typeorm/entities/Post";
import { PostModule } from "../posts/post.module";
import { NotificationModule } from "../notification/notification.module";

@Module({
    imports: [TypeOrmModule.forFeature([Emotion, Post, User]), PostModule, NotificationModule],
    controllers: [EmotionController],
    providers: [EmotionService],
    exports: [EmotionService]
})
export class EmotionModule{};