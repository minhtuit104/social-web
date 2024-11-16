import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Emotion } from "src/typeorm/entities/Emotion";
import { Post } from "src/typeorm/entities/Post";
import { User } from "src/typeorm/entities/User";
import { Repository } from "typeorm";
import { CreateEmotionDto } from "./dto/create.dto";

@Injectable()
export class EmotionService{
    constructor(
        @InjectRepository(Emotion) private readonly emotionRepository: Repository<Emotion>,
        @InjectRepository(Post) private postsRepository: Repository<Post>,
        @InjectRepository(User) private usersRepository: Repository<User>,
    ){}

    async findOne(id: number): Promise<Emotion>{
        const emotion = await this.emotionRepository.findOne({where: {idEmotion: id}, relations: ['post', 'user']});
        if(!emotion){
            throw new Error('Emotion not found');
        }
        return emotion;
    }

    // thêm hoặc cập nhật emotion
    async addOrUpdateEmotion(createEmotionDto: CreateEmotionDto, idUser: number): Promise<Emotion> {
        const { idPost, emotion } = createEmotionDto;
        const post = await this.postsRepository.findOne({ where: { idPost: idPost } });
        const user = await this.usersRepository.findOne({ where: { idUser: idUser } });

        if(!post || !user){
            throw new Error('Post or User not found');
        }

        // Kiểm tra xem đã tồn tại emotion cho post và user này chưa
        let existingEmotion = await this.emotionRepository.findOne({
            where: { post: { idPost }, user: { idUser } }
        });

        if (existingEmotion) {
            // Nếu đã tồn tại, cập nhật emotion
            existingEmotion.emotion = emotion;
            return this.emotionRepository.save(existingEmotion);
        } else {
            // Nếu chưa tồn tại, tạo mới emotion
            const newEmotion = this.emotionRepository.create({
                post,
                user,
                emotion
            });
            return this.emotionRepository.save(newEmotion);
        }
    }

    // Xóa emotion
    async deleteEmotion(idEmotion: number): Promise<void>{
        const emotion = await this.findOne(idEmotion);
        if(!emotion){
            throw new NotFoundException('Không tìm thấy cảm xúc');
        }
        await this.emotionRepository.remove(emotion);
    }

    // lấy emotion theo post
    async getEmotionsByPost(idPost: number): Promise<Emotion[]>{
        const emotions = await this.emotionRepository.find({
            where: {post: {idPost: idPost}},
            relations: ['user'],
        });
        if(!emotions){
            throw new NotFoundException('Không tìm thấy cảm xúc');
        }
        return emotions;
    }

    // Đếm số lượng emotion theo post
    async countEmotionsByPost(idPost: number): Promise<any>{
        const emotionTypes = ['like', 'love', 'haha', 'wow', 'sad', 'angry'];
        // Đếm số lượng cảm xúc từng loại
        const counts = await Promise.all(
            emotionTypes.map(async (type) => ({
                type,
                count: await this.emotionRepository.count({
                    where: { post: { idPost: idPost }, emotion: type },
                }),
            })),
        );

        // tổng số lượng emotion
        const totalEmotionCount = counts.reduce((acc, curr) => acc + curr.count, 0);
        return totalEmotionCount;
    }

    // lấy danh sách cảm xúc của user
    async getEmotionsByUser(userId: number): Promise<Emotion[]>{
        const user = await this.usersRepository.findOne({ where: { idUser: userId } });
        if(!user){
            throw new NotFoundException('Không tìm thấy user');
        }
        const emotions = await this.emotionRepository.find({
            where: {user: { idUser: userId }},
            relations: ['post']
        });
        return emotions;
    }
}