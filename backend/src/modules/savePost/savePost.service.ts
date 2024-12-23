import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { SavedPost } from '../../typeorm/entities/SavePost';

@Injectable()
export class SavedPostService {
    constructor(
        @InjectRepository(SavedPost)
        private savedPostRepository: Repository<SavedPost>
    ) {}

    async savePost(userId: number, postId: number) {
        const existingSave = await this.savedPostRepository.findOne({
            where: {
                user: { idUser: userId },
                post: { idPost: postId }
            }
        });

        if (existingSave) {
            await this.savedPostRepository.remove(existingSave);
            return { saved: false };
        }

        const savedPost = this.savedPostRepository.create({
            user: { idUser: userId },
            post: { idPost: postId }
        });
        await this.savedPostRepository.save(savedPost);
        return { saved: true };
    }

    async getSavedPost(userId: number) {
        const savedPosts = await this.savedPostRepository.find({
            where: { user: { idUser: userId } },
            relations: ['post', 'post.authorId'],
            order: {
                savedAt: 'DESC'
            }
        });
        return savedPosts;
    }

    async checkIfPostIsSaved(userId: number, postId: number) {
        const savedPost = await this.savedPostRepository.findOne({
            where: {
                user: { idUser: userId },
                post: { idPost: postId }
            }
        });
        return !!savedPost;
    }

    async checkMultiplePosts(userId: number, postIds: number[]) {
        const savedPosts = await this.savedPostRepository.find({
            where: { 
                user: { idUser: userId }, 
                post: { idPost: In(postIds) },
            },
            relations: ['post']
        });
        // Lấy danh sách các idPost đã được lưu
        const savedPostIds = savedPosts.map(sp => sp.post?.idPost).filter(id => id !== null);
        // Tạo một đối tượng chứa trạng thái saved cho mỗi postId
        const result = postIds.reduce((acc, postId) => {
            acc[postId] = savedPostIds.includes(postId);
            return acc;
        }, {} as { [key: number]: boolean });
        return result;
    }
}