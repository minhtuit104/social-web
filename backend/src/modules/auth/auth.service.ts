import { HttpException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "../users/dtos/create.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/typeorm/entities/User";
import { Repository } from "typeorm";
import { Account } from "src/typeorm/entities/Account";
import { CreateAccountDto } from "../accounts/dtos/create.dto";
import { LoginDto } from "./dtos/login.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';

@Injectable()

export class AuthService{

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Account) private accountReponsetory: Repository<Account>,
        private jwtService: JwtService,
    ){}

    async register(createUserDto: CreateUserDto){
        //kiểm tra xem idUser đã tồn tại hay chưa
        // const findUserById = await this.userRepository.findOne({
        //     where: {idUser: createUserDto.idUser},
        // });
        const findUserByEmail = await this.userRepository.findOne({where: {email: createUserDto.email}});
        //kiểm tra
        if(findUserByEmail){
            throw new HttpException('idUser hoặc email đã tồn tại', 400);
        }else{
            //tạo ra một đối tượng user
            const newUser: CreateUserDto = {
                
                name: createUserDto.name,
                email: createUserDto.email,
                birthday: createUserDto.birthday,
                avarta: createUserDto.avarta,
                password: createUserDto.password,
                active: createUserDto.active
            }
            //khởi tạo newInstance
            const newUserInstance = await this.userRepository.save(newUser);

            const newAccount =this.accountReponsetory.create({
                idUser: newUserInstance.idUser,
                email: createUserDto.email,
                password: createUserDto.password,
                refreshToken: ""
                
            });

            return await this.accountReponsetory.save(newAccount);
        }

    }

    async login(loginDto: LoginDto){
        //Kiểm tra email có tồn tại trong db không?
        const findUserByEmail = await this.accountReponsetory.findOne({where: {email: loginDto.email}});
        if(!findUserByEmail){
            throw new HttpException("Account not registered", 400);
        } else{
            //Hash password
            const comparePassword =  bcrypt.compareSync(
                loginDto.password,
                findUserByEmail.password,
            );

            if(!comparePassword){
                throw new HttpException('Password is incorrect!!', 400);
            } else{
                //dữ liệu + acces_token
                const payload = {
                    idAccount: findUserByEmail.idAccount,
                    idUser: findUserByEmail.idUser,
                    email: findUserByEmail.email,
                    role: findUserByEmail.role,
                };

                const access_token = await this.jwtService.signAsync(payload);
                const refresh_token =  await this.jwtService.signAsync(payload,{
                    secret: 'THISISSECRETKEY',
                    expiresIn: '1d' 
                })
                findUserByEmail.refreshToken = refresh_token;
                await this.accountReponsetory.save(findUserByEmail);

                const { password, ...userData } = findUserByEmail; // Loại bỏ password nếu khi trả về

                return {...userData, access_token};
                    
                
            }
        }          
    }
}