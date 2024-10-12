import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Comment } from "src/typeorm/entities/Comment";
import { Repository } from "typeorm";
import { UpdateCommentDto } from "./dto/update.dto";
import { CreateCommentDto } from "./dto/create.dto";
import { Post } from "src/typeorm/entities/Post";
import { User } from "src/typeorm/entities/User";

@Injectable()
export class CommentService{

    constructor(
        @InjectRepository(Comment) private commentRepository: Repository<Comment>,
        @InjectRepository(Post) private postsRepository: Repository<Post>,
        @InjectRepository(User) private usersRepository: Repository<User>,
    ) {}

    async findAll(){
        return await this.commentRepository.find({
            relations: ['user']
        });
    }


    async findOne(id: number){
        const comment =  await this.commentRepository.findOne({
            where: {idComment: id},
            relations: ['user', 'post'],
        });

        if(!comment){
            throw new Error('Comment not found');
        }
        return plainToInstance(Comment, comment);
    }


    async createdComment(createCommentDto: CreateCommentDto, idUser: number): Promise<Comment>{

        const {idPost, comment} = createCommentDto;
        const post = await this.postsRepository.findOne({where: {idPost: idPost}});
        const user = await this.usersRepository.findOne({where: {idUser: idUser}});

        if (!user || !post) {
            throw new Error('User or Post not found');
          }

        const newComment = this.commentRepository.create({
            comment,
            post,
            user,
        });
        return this.commentRepository.save(newComment);
    }

 
    async updateComment(id: number, updateCommentDto: UpdateCommentDto){
        const findComment = await this.findOne(id);

        if(!findComment){
            return null;
        }else{
            this.commentRepository.merge(findComment, updateCommentDto);

            return this.commentRepository.save(findComment);
        }
    }

    
    async removeComment(id : number){
        const comment = await this.findOne(id);
        if(!comment){
            throw new NotFoundException('Comment not found');
        }else{
            return this.commentRepository.remove(comment);
        }
    }

    async getCommentsByPost(idPost: number){
        const comment = await this.commentRepository.find({
            where: {post: {idPost: idPost}},
            relations: ['subComments','subComments.user', 'user'],
        });

        if(!comment){
            throw new Error('Comment not found');
        }
        return plainToInstance(Comment, comment);
    }
}