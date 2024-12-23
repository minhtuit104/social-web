import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Friend } from "src/typeorm/entities/Friend";
import { User } from "src/typeorm/entities/User";
import { Repository } from "typeorm";
import { PaginatedResponse } from "../pagination/pagination.interface";

@Injectable()
export class FriendService {
    constructor(
        @InjectRepository(Friend)
        private readonly friendRepository: Repository<Friend>, 
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    //Gửi lời mời kết bạn
    async sendFriendRequest(userId: number, friendId: number): Promise<Friend> {
        if(userId === friendId) {
            throw new BadRequestException('Không thể gửi lời mời kết bạn với chính mình');
        }

        const existingFriendRequest = await this.friendRepository.findOne({
            where: [{user: {idUser: userId}, friend: {idUser: friendId}}, {user: {idUser: friendId}, friend: {idUser: userId}}]
        });

        if(existingFriendRequest) {
            throw new BadRequestException('Lời mời kết bạn đã tồn tại');
        }

        const user = await this.userRepository.findOne({where: {idUser: userId}});
        const friend = await this.userRepository.findOne({where: {idUser: friendId}});
        if(!user || !friend) {
            throw new NotFoundException('Người dùng không tồn tại');
        }

        const newFriendRequest = this.friendRepository.create({
            user, 
            friend,
            status: 'pending',
        });

        return this.friendRepository.save(newFriendRequest);
    }

    //Chấp nhận lời mời kết bạn
    async acceptFriendRequest(userId: number, friendId: number): Promise<Friend> {
        const friendRequest = await this.friendRepository.findOne({
            where: {user: {idUser: friendId}, friend: {idUser: userId}, status: 'pending'}
        });

        friendRequest.status = 'accepted';
        return this.friendRepository.save(friendRequest);
    }

    //Từ chối lời mời kết bạn
    async rejectFriendRequest(userId: number, friendId: number): Promise<void> {
        const friendRequest = await this.friendRepository.findOne({
            where: {user: {idUser: friendId}, friend: {idUser: userId}, status: 'pending'}
        });
        if(!friendRequest) {
            throw new NotFoundException('Lời mời kết bạn không tồn tại');
        }

        await this.friendRepository.remove(friendRequest);
    }

    //Xóa yêu cầu kết bạn
    async CancelFriendRequest(userId: number, friendId: number): Promise<void> {
        const friendRequest = await this.friendRepository.findOne({
            where: {
                user: {idUser: userId}, 
                friend: {idUser: friendId},
                status: 'pending'
            }
        });

        if(!friendRequest) {
            throw new NotFoundException('Lời mời kết bạn không tồn tại');
        }

        await this.friendRepository.remove(friendRequest);
    }

    //lấy danh sách lời mời kết bạn
    async getFriendRequest(friendId: number, page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Friend>> {
        const [friendRequests, total] = await this.friendRepository.findAndCount({
            where: {friend: {idUser: friendId}, status: 'pending'}, 
            relations: ['user'],
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: {createdAt: 'DESC'}
        });
        return {
            data: friendRequests,
            pagination: {
                total,
                last_page: Math.ceil(total / pageSize),
                pageSize,
                page
            }
        };
    }

    //Lấy danh sách lời mời kết bạn đã gửi
    async getFriendRequestSent(userId: number, page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Friend>> {
        const [friendRequests, total] = await this.friendRepository.findAndCount({
            where: {user: {idUser: userId}, status: 'pending'}, 
            relations: ['friend'],
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: {createdAt: 'DESC'}
        });
        return {
            data: friendRequests,
            pagination: {
                total,
                last_page: Math.ceil(total / pageSize),
                pageSize,
                page
            }
        };
    }

    //lấy danh sách bạn bè
    async getFriendList(userId: number, page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<User>> {
        const [sentFriends, totalSent] = await this.friendRepository.findAndCount({
            where: { 
                user: { idUser: userId }, 
                status: 'accepted'
            },
            relations: ['friend'],
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        
        const [receivedFriends, totalReceived] = await this.friendRepository.findAndCount({
            where: { 
                friend: { idUser: userId }, 
                status: 'accepted'
            },
            relations: ['user'],
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        const allFriends = [
            ...sentFriends.map(f => f.friend),
            ...receivedFriends.map(f => f.user)
        ];

        const total = totalSent + totalReceived;
        return {
            data: allFriends,
            pagination: {
                total,
                last_page: Math.ceil(total / pageSize),
                pageSize,
                page
            }
        };
    }

    //hàm kiểm tra trạng thái bạn bè
    async checkFriendshipStatus(userId: number, friendId: number): Promise<string> {
        const friendship = await this.friendRepository.findOne({
            where: [
                { 
                    user: { idUser: userId },
                    friend: { idUser: friendId }
                },
                {
                    user: { idUser: friendId },
                    friend: { idUser: userId }
                }
            ]
        });
    
        if (!friendship) return 'not_friend';
        return friendship.status;
    }

    //hàm xóa bạn bè
    async deleteFriend(userId: number, friendId: number): Promise<void> {
        const friendship = await this.friendRepository.findOne({
            where: [
                { 
                    user: { idUser: userId },
                    friend: { idUser: friendId },
                    status: 'accepted'
                },
                {
                    user: { idUser: friendId },
                    friend: { idUser: userId },
                    status: 'accepted'
                }
            ]
        });

        if(!friendship) {
            throw new NotFoundException('Mối quan hệ bạn bè không tồn tại');
        }

        await this.friendRepository.remove(friendship);
    }

    //Check xem lời mời kết bạn có tồn tại trong database hay không
    async checkRequestExists(userId: number, friendId: number): Promise<boolean> {
        try {
            const request = await this.friendRepository.findOne({
                where: [{user: {idUser: friendId}, 
                friend: {idUser: userId}, 
                status: 'pending'
                }]
            });
            return !!request;
        } catch (error) {
            console.error('Lỗi khi kiểm tra lời mời kết bạn:', error);
            throw new NotFoundException('Lời mời kết bạn không tồn tại');
        }
    }

}   