import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { DataSource } from 'typeorm';
import { Account } from './typeorm/entities/Account';
import { AccountModule } from './modules/accounts/account.module';
import { Post } from './typeorm/entities/Post';
import { PostModule } from './modules/posts/post.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommentModule } from './modules/comment/comment.module';
import { Comment } from './typeorm/entities/Comment';
import { SubComment } from './typeorm/entities/SubComment';
import { SubCommentModule } from './modules/subcomment/subcomment.module';
import { MessagerModule } from './modules/messager/messager.module';
import { Messager } from './typeorm/entities/Messager';
import { GatewayModule } from './modules/gateway/gateway.module';
import { Notification } from './typeorm/entities/Notification';
import { NotificationModule } from './modules/notification/notification.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      database: "web_social",
      username: "root",
      password: "12345",
      port: 3306,
      host: "localhost",
      type: "mysql",
      autoLoadEntities: true,
      entities: [User,Account, Post, Comment, SubComment, Messager, Notification],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    AccountModule,
    PostModule,
    CommentModule,
    SubCommentModule,
    MessagerModule,
    GatewayModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
