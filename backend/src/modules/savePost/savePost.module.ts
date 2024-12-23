import { Module } from "@nestjs/common";
import { SavedPostService } from "./savePost.service";
import { SavedPostController } from "./savePost.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SavedPost } from "src/typeorm/entities/SavePost";

@Module({
    imports: [TypeOrmModule.forFeature([SavedPost])],
    controllers: [SavedPostController],
    providers: [SavedPostService],
})
export class SavedPostModule {}