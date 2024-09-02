import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/typeorm/entities/User";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dtos/create.dto";
import { UpdateUserDto } from "./dtos/update.dto";

@Injectable()

export class UserService{

    constructor(@InjectRepository(User) private userRepository: Repository<User>){}

    async findAll(){
        return await this.userRepository.find();
    }

    async findOne(id: number){
        return await this.userRepository.findOne({where: {idUser: id } });
    }

    async remove(id: number){
        //tìm kiếm theo id
        const findUser = await this.findOne(id);
        if(findUser){
            return this.userRepository.remove(findUser);
        }
    }

    async create(createUserDto: CreateUserDto){
        const newUser = {
            ...createUserDto,
            active: new Date(),
        };
        //tạo instance từ entity nhưng không lưu vào Database
        const newInstance = this.userRepository.create(newUser);

        //Lưu từ Instance vào trong database
        return await this.userRepository.save(newInstance);
    }

    async update(id: number, updateUserDto: UpdateUserDto){
        //tìm kiếm user theo id trong database
        const findUser = await this.findOne(id);

        //kiểm tra xem id có tồn tại hay không
        if(!findUser){
            return null;
        }else{
            //cập nhật lại thực thể user với dữ liệu mới
            this.userRepository.merge(findUser, updateUserDto);

            //lưu dữ liệu được ncập nhật vào trong database
            return this.userRepository.save(findUser);
        }
    }
}