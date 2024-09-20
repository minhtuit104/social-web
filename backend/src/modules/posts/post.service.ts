import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "src/typeorm/entities/Post";
import { Repository } from "typeorm";
import { CreatePostDto } from "./dtos/create.dto";
import { PostDTO } from "./dtos/postDTO";
import { plainToInstance } from "class-transformer";
import { UpdatePostDto } from "./dtos/update.dto";
import { User } from "src/typeorm/entities/User";

@Injectable()

export class PostService{

    constructor(
        @InjectRepository(Post) private postRepository: Repository<Post>,
        @InjectRepository(User) private userRepository: Repository<User>) {}

    async findAll(){
        return await this.postRepository.find({
            relations: ['authorId'],
        });
    }

    async findOne(id: number){
        const post = await this.postRepository.findOne({
            where: {idPost: id},
        });

        if(!post){
            throw new Error('Post not found');
        }
        return plainToInstance(Post, post);
    }

    async remove(id: number){
        const post = await this.findOne(id);
        if(!post){
            throw new NotFoundException('Post not found');
        }else{
            return this.postRepository.remove(post);
        }
    }

    async create(createPostDto: CreatePostDto, authorId: number){
        
        const newInstance = this.postRepository.create({
            ...createPostDto,
            authorId: {idUser: authorId}
        });

        const savePost = await this.postRepository.save(newInstance);

        const author = await this.userRepository.findOne({where: {idUser: authorId}});

        return {
            ...savePost,
            authorId: author
        };
    }

    async update(id: number, updatePostDto: UpdatePostDto){
        const findPost = await this.findOne(id);

        if(!findPost){
            return null;
        }else{
            this.postRepository.merge(findPost, updatePostDto);

            return this.postRepository.save(findPost);
        }
    }
}