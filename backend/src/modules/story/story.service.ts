import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Story } from "src/typeorm/entities/Story";
import { MoreThan, Repository } from "typeorm";
import { CreateStoryDto } from "./dto/create.dto";
import { User } from "src/typeorm/entities/User";

@Injectable()
export class StoryService {
    constructor(
        @InjectRepository(Story) private readonly storyRepository: Repository<Story>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        
    ) {}


    async createStory(createStoryDto: CreateStoryDto, userId: number) {
        try {
            const author = await this.userRepository.findOne({
                where: {
                    idUser: userId
                }
            });
            if (!author) {
                throw new NotFoundException('Author not found');
            }
            const newStory = this.storyRepository.create({
                ...createStoryDto, 
                authorId: {idUser: userId}
            });
            const savedStory = await this.storyRepository.save(newStory);
            return {
                ...savedStory,
                authorId: author
            };
        } catch (error) {
            console.error('Error creating story', error);
            throw error;
        }
    }

    //lấy tất cả các story trong 24h gần nhất
    async findAll() {
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        const stories = await this.storyRepository.find({
            where: {
                isActive: true,
                createdAt: MoreThan(twentyFourHoursAgo)
            },
            relations: ['authorId'],
            order: {
                createdAt: 'DESC'
            }
        });
        return stories;
    }

    async findOneByUserId(userId: number) {
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
        const story = await this.storyRepository.findOne({
            where: {
                authorId: {idUser: userId},
                isActive: true,
                createdAt: MoreThan(twentyFourHoursAgo)
            },
            relations: ['authorId'],
            order: {
                createdAt: 'DESC'
            }
        });
        return story;
    }

}