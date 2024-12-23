import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Story } from "src/typeorm/entities/Story";
import { StoryService } from "./story.service";
import { StoryController } from "./story.controller";
import { User } from "src/typeorm/entities/User";

@Module({
    imports: [TypeOrmModule.forFeature([Story, User])],
    controllers: [StoryController],
    providers: [StoryService],
    exports: [StoryService, TypeOrmModule.forFeature([Story])]
})
export class StoryModule {}