import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "src/typeorm/entities/Post";
import { Repository } from "typeorm";
import { CreatePostDto } from "./dtos/create.dto";
import { PostDTO } from "./dtos/postDTO";
import { plainToInstance } from "class-transformer";
import { UpdatePostDto } from "./dtos/update.dto";
import { User } from "src/typeorm/entities/User";
import { PaginatedResponse } from "../pagination/pagination.interface";

@Injectable()

export class PostService{

    constructor(
        @InjectRepository(Post) private postRepository: Repository<Post>,
        @InjectRepository(User) private userRepository: Repository<User>) {}

    async findAll(page: number = 1, pageSize: number = 5): Promise<PaginatedResponse<Post>>{
        const [posts, total] = await this.postRepository.findAndCount({
            relations: ['authorId'],
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: {idPost: 'DESC'}
        });

        return {
            data: posts,
            pagination: {
                total,
                last_page: Math.ceil(total / pageSize),
                pageSize,
                page
            }
        }
    }

    async findOne(id: number){
        const post = await this.postRepository.findOne({
            where: {idPost: id},
            cache: false,
            relations: ['authorId']
        });

        if(!post){
            throw new Error('Post not found');
        }
        return post;
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

        const author = await this.userRepository.findOne({where: {idUser: authorId}});
        if (!author) {
            throw new NotFoundException('Author not found');
        }

        const newInstance = this.postRepository.create({
            ...createPostDto,
            authorId: {idUser: authorId}
        });

        const savePost = await this.postRepository.save(newInstance);

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

    async fetchPostByIdUser(idUser: number, page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Post>>{
        const [posts, total] = await this.postRepository.findAndCount({
            where: {authorId: {idUser: idUser}},
            relations: ['authorId'],
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: {idPost: 'DESC'}
        });

        return {
            data: posts,
            pagination: {
                total,
                last_page: Math.ceil(total / pageSize),
                pageSize,
                page
            }
        }
    }
}