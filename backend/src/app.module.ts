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
      entities: [User,Account, Post],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    AccountModule,
    PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
