import { Module } from "@nestjs/common";
import { SubCommentController } from "./subcomment.controller";
import { SubCommentService } from "./subcomment.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubComment } from "src/typeorm/entities/SubComment";

@Module({
    imports: [TypeOrmModule.forFeature([SubComment])],
    controllers: [SubCommentController],
    providers: [SubCommentService],

})

export class SubCommentModule {}