import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/typeorm/entities/User";
import { JwtModule } from "@nestjs/jwt";
import { Account } from "src/typeorm/entities/Account";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwtStrategys/jwt.strategy";

@Module({
    imports:[TypeOrmModule.forFeature([User, Account]),
        PassportModule.register({defaultStrategy: 'jwt'}),
        JwtModule.register({
            global: true,
            secret: 'THISISSECRETKEY',
            signOptions: { expiresIn: '1h' },
        })],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule{}