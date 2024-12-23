import { 
    WebSocketGateway,
    WebSocketServer, 
    SubscribeMessage, 
    OnGatewayConnection, 
    OnGatewayDisconnect, 
    ConnectedSocket, 
    MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagerService } from '../messager/messager.service';
import { JwtService } from '@nestjs/jwt';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwtAuthGuard/jwtAuthGuard';
import { CommentService } from '../comment/comment.service';
import { PostService } from '../posts/post.service';
import { NotificationService } from '../notification/notification.service';
import { UserService } from '../users/user.service';
import { EmotionService } from '../emotion/emotion.service';
import { FriendService } from '../friends/friend.service';

@WebSocketGateway({
  cors: {
    origin: '*',  // Cho phép mọi nguồn truy cập
  },
})
export class MyGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messageService: MessagerService,
    private readonly jwtService: JwtService,
    private readonly commentService: CommentService,
    private readonly postService: PostService,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
    private readonly emotionService: EmotionService,
    private readonly friendService: FriendService
  ) {}

  // Hàm này sẽ được gọi khi client kết nối
  @UseGuards(JwtAuthGuard)
  handleConnection(client: Socket) {
    try{
        //lấy token từ client
        const token = client.handshake.auth.token;
        if(!token){
            throw new Error("Invalid token");
        }
        //Giải mã token lấy thông tin user  
        const decodedToken = this.jwtService.verify(token);
        const idUser = decodedToken.idUser;
        client.data.idUser = idUser;
        console.log(`User ${idUser} connected`);
    }catch(error){
        console.log("Invalid token", error);
        client.disconnect();
    }
  }

  // Hàm này sẽ được gọi khi client ngắt kết nối
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Thực hiện các hành động như xóa người dùng khỏi danh sách online
  }

  // Sự kiện gửi tin nhắn
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { receiverId: number, content: string },
    @ConnectedSocket() client: Socket
  ) {
    const senderId = client.data.idUser;
    console.log("data---------->: ", data);
    // // Lưu tin nhắn vào cơ sở dữ liệu
    const message = await this.messageService.createMessage(senderId, data.receiverId, data.content);
    //gửi tin nhắn đến người nhận
    const receiverSocket = this.getSocketByUserId(data.receiverId);
    if(receiverSocket){
        this.server.to(receiverSocket.id).emit('receiveMessage', message);
    }
  }

  //bắt sự kiện khi người dùng thêm bình luận
  @SubscribeMessage('newComment')
  async handleNewComment(
    @MessageBody() data: { idPost: number, comment: string },
    @ConnectedSocket() client: Socket
  ) {
      const idUser = client.data.idUser;

      try{
        //1. Gọi service để lưu bình luận 
        const newComment = await this.commentService.createdComment({
          idPost: data.idPost,
          comment: data.comment
        }, idUser);

        //2. Lấy thông tin  người dùng tù bài viết
        const user = await this.userService.findOne(idUser);
        //lấy thông tin bài viết
        let post = await this.postService.findOne(data.idPost);
        //lấy số lượng bình luận của bài viết
        const commentCount = await this.commentService.countCommentByPost(post.idPost);
        //cập nhật số totalComment của bài viết
        const updatedPost = await this.postService.update(post.idPost, {totalComment: commentCount});
        console.log("totalComment sau khi cập nhật: ", updatedPost.totalComment);
        //3. Tạo thông báo khi có bình luận mới
        if(idUser !== post.authorId.idUser){
          await this.notificationService.createCommentNotification(post, newComment, user);

          //4. Gửi thông báo bình luận tới tác giả bài viết
          const postAuthorSocket = this.getSocketByUserId(post.authorId.idUser);
          if(postAuthorSocket){
            this.server.to(postAuthorSocket.id).emit('receiveNewComment', {
            postId: data.idPost,
            comment: data.comment,
            author: newComment.user.name
          });
          }else{
            console.log(`Không tìm thấy socket của người dùng ${post.authorId.idUser}`);
          }
        }
        
        //5. Gửi sự kiện cập nhật totalComment đến tất cả các client
        this.server.emit('updateTotalComment', {
          postId: post.idPost,
          totalComment: post.totalComment
        });
      

        return newComment;
      }catch(error){
        console.error('Error in handleNewComment: ', error);
        throw new Error('Failed to handle new comment');
      }
  }

  // bắt sự kiện khi người dùng thêm cảm xúc
  @SubscribeMessage('addEmotion')
  async handleAddEmotion(
    @MessageBody() data: { idPost: number, emotion: string },
    @ConnectedSocket() client: Socket
  ) {
    const idUser = client.data.idUser;

    try{
      const newEmotion = await this.emotionService.addOrUpdateEmotion({
        idPost: data.idPost, 
        emotion: data.emotion
      }, idUser);

      //lấy thông tin người dùng từ bài viết
      const user = await this.userService.findOne(idUser);

      //lấy thông tin bài viết
      const post = await this.postService.findOne(data.idPost);

      //lấy số lượng cảm xúc của bài viết và cập nhật
      const emotionCount = await this.emotionService.countEmotionsByPost(post.idPost);
      const updatedPost = await this.postService.update(post.idPost, {totalEmotion: emotionCount});
      console.log("totalEmotion sau khi cập nhật: ", updatedPost.totalEmotion);
      if(idUser !== post.authorId.idUser){
        
        //tạo thông báo khi có cảm xúc mới
        const notification = await this.notificationService.createOrUpdateEmotionNotification(
          post, 
          newEmotion, 
          user
        );
      
        //gửi sự kiện cập nhật số lượng cảm xúc đến tất cả các client
        const postAuthorSocket = this.getSocketByUserId(post.authorId.idUser);
        if(postAuthorSocket){
          this.server.to(postAuthorSocket.id).emit('receiveNewEmotion', {
          postId: data.idPost,
          emotion: data.emotion,
          author: user.name,
          notification
        });
        }else{
          console.log(`Không tìm thấy socket của người dùng ${post.authorId.idUser}`);
        }
      } 
      //gửi sự kiện cập nhật số lượng cảm xúc đến tất cả các client
      this.server.emit('updateTotalEmotion', {
        postId: post.idPost,
        totalEmotion: updatedPost.totalEmotion
      });

      return {
        status: 'success',
        emotion: newEmotion,
        totalEmotion: updatedPost.totalEmotion
      };

    }catch(error){
      throw new Error('Failed to handle add emotion');
    }
  }

  @SubscribeMessage('addFriend')
  async handleAddFriend(
    @MessageBody() data: { idUser: number },
    @ConnectedSocket() client: Socket
  ) {
    const senderId = client.data.idUser;
    try{
      //gửi lời mời kết bạn
      const friendRequest = await this.friendService.sendFriendRequest(senderId, data.idUser);

      //lấy thông tin người gửi và người nhận
      const sender = await this.userService.findOne(senderId);
      const receiver = await this.userService.findOne(data.idUser);

      //tạo thông báo khi có lời mời kết bạn
      const notification = await this.notificationService.createFriendRequestNotification(sender, receiver);

      //gửi sự kiện lời mời kết bạn đến người nhận
      const receiverSocket = this.getSocketByUserId(data.idUser);
      if(receiverSocket){
        this.server.to(receiverSocket.id).emit('receiveFriendRequest', {
          notification: notification,
          sender: {
            idUser: sender.idUser,
            name: sender.name,
            avarta: sender.avarta
          }
        });
      }

      return {
        status: 'success',
        message: 'Friend request sent successfully',
        data: friendRequest
      };
    }catch(error){
      throw new Error('Failed to handle add friend');
    }

  }

  //lấy socket theo id người dùng theo idUser
  getSocketByUserId(userId: number): Socket | undefined {
    return [...this.server.sockets.sockets.values()].find(socket => socket.data.idUser === userId);
  }

  // Khi user tham gia room
  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() userId: number, @ConnectedSocket() client: Socket) {
    client.join(`user_${userId}`);
    console.log(`User ${userId} joined room user_${userId}`);
  }
}