import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { SubComment } from "src/typeorm/entities/SubComment";
import { User } from "src/typeorm/entities/User";
import { Repository } from "typeorm";
import { UpdateSubCommentDto } from "./dto/update.dto";
import { CreateSubCommentDto } from "./dto/created.dto";

@Injectable()
export class SubCommentService{

    constructor(
        @InjectRepository(SubComment) private subCommentRepository: Repository<SubComment>,
        // @InjectRepository(Comment) private commentRepository: Repository<Comment>,
        // @InjectRepository(User) private userRepository: Repository<User>,

    ){}
   
    async findAll(){
        return await this.subCommentRepository.find({
            relations: ['user', 'comment']
        });
    }


    async findOne(id: number){
        const subcomment = await this.subCommentRepository.findOne({
            where: {idSubcomment: id},
            relations: ['user', 'comment'],
        });
        if(!subcomment){
            throw new Error('Subcomment not found');
        }
        return plainToInstance(SubComment, subcomment);
    }


    async createdSubComment(createSubcommentDto: CreateSubCommentDto, idUser: number): Promise<SubComment>{
        const {idComment, subcomment} = createSubcommentDto;

        const newSubcomment = this.subCommentRepository.create({
            subcomment,
            user : {idUser: idUser}, //lấy idUser từ token
            comment: {idComment: idComment}, //Lấy idComment từ body
        });
        return await this.subCommentRepository.save(newSubcomment);
    }

 
    async updateSubComment(id: number, updateSubcommentDto: UpdateSubCommentDto){
        const findSubcomment = await this.findOne(id);

        if(!findSubcomment){
            return null;
        }else{
            this.subCommentRepository.merge(findSubcomment, updateSubcommentDto)
            return this.subCommentRepository.save(findSubcomment);
        }
    }


    async removeSubComment(id: number){
        const subcomment = await this.findOne(id);
        if(!subcomment){
            throw new NotFoundException('SubComment not found');
        }else{
            return this.subCommentRepository.remove(subcomment);
        }
    }

    async getSubcommentsByComment(idComment: number){
        const subcomment = await this.subCommentRepository.find({
            where: {comment: {idComment: idComment}},
            relations: ['user', 'comment'],
        });

        if(!subcomment){
            throw new Error('Subcomment not found');
        }

        return plainToInstance(SubComment, subcomment);
    }
}