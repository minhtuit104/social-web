import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Friend } from "src/typeorm/entities/Friend";
import { FriendController } from "./friend.controller";
import { FriendService } from "./friend.service";
import { User } from "src/typeorm/entities/User";

@Module({
    imports: [TypeOrmModule.forFeature([Friend, User])],
    controllers: [FriendController],
    providers: [FriendService],
    exports: [FriendService],
})
export class FriendModule {}