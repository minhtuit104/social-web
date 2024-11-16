import { useEffect, useState } from "react";
import "./chatNotificationModal.css";
import MessageNotification from "./MessageNotification";
import { getMessageWithUser } from "../../services/MessageService";
import { fectchUserName } from "../../services/UserService";
import IconClose from "../../assets/images/icons/ic_close.svg";
import InfiniteScroll from "react-infinite-scroll-component";
/* eslint-disable @typescript-eslint/no-unused-vars */

const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
  return null;
};


  const ChatNotificationModal = ({ socket }: { socket: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserInfo, setSelectedUserInfo] = useState<any>(null);
  const [message, setMessage] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [avarta, setAvarta] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [paginationInfo, setPaginationInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const userInfo = getUserFromToken();
  const currentUserId = userInfo?.idUser;

  // Đóng cửa sổ chat
  const handleCloseChat = () => setIsOpen(false);

  //hàm fetch tin nhắn với pagination
  const fetchMessages = async (userId1: number, userId2: number, page: number) => {
    if(!userId1 || !userId2 || loading){
      console.log("Lỗi ở đây...");
      return;
    };

    try {
      setLoading(true);
      const res = await getMessageWithUser(userId1, userId2, page);
      console.log("API response: ", res);
      if(res && res.data){

        const {data: {data: newMessages, pagination}} = res;
        console.log("New Messages: ", newMessages);
        const updateMessage = newMessages.map((msg: any) => ({
          ...msg,
          own: msg.sender.idUser === userId1,
          time: msg.createAt,
          avarta: msg.sender.avarta ?? 'https://www.gravatar.com/avatar/?d=mp',
        }));

        if(page === 1){
          const sortedMessages = updateMessage.sort((a: any, b: any) => 
            new Date(a.time).getTime() - new Date(b.time).getTime()
          );
          console.log("Sorted Messages: ", sortedMessages);
          setMessage(sortedMessages);
        } else {
          setMessage((prevMessages) => {
            const allMessages = [...prevMessages, ...updateMessage];
            return allMessages.sort((a: any, b: any) => 
              new Date(a.time).getTime() - new Date(b.time).getTime()
            );
          });
        }
        setHasMore(page < pagination.last_page);
        setPaginationInfo(pagination);
      } else {
        if(page === 1){
          setMessage([]);
        }
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }
  
  //fetch thông tin người dùng
  useEffect(() => {
    const getUser = async () => {
      if (currentUserId) {
        const userData = await fectchUserName(currentUserId);
        setAvarta(userData?.avarta);
      }
    };
    getUser();
  }, [currentUserId]);


  //lắng nghe sự kiện nhận tin nhắn từ socket
  useEffect(() => {
    if (!socket) {
      console.warn("Socket is null or undefined");
      return;
    }
      const onConnect = () => {
        console.log("socket đã kết nối nhé!!<3", socket.connected);
        //lắng nghe sự kiện nhận tin nhắn từ socket
        socket?.on('receiveMessage', async (message: any) => {
          console.log("tin nhắn nhận được: ", message);
          const senderId = message.sender.idUser;
          console.log("ID nguoi gui tin nhan: ", senderId);

          setSelectedUserId(senderId); //lưu id của người gửi tin nhắn tới

          //lưu thông tin người gửi tin nhắn vào state
          setSelectedUserInfo({
            avarta: message.sender.avarta ?? 'https://www.gravatar.com/avatar/?d=mp',
            name: message.sender.name,
          });

          setIsOpen(true); //mở cửa sổ chat

          setPage(1); //reset page về 1
          //fetch tin nhắn với page 1
          if(currentUserId){
            try {
              await fetchMessages(currentUserId, senderId, 1);
            } catch (error) {
              console.error('Failed to fetch message:', error);
            }
          }

        });
      };
      
      socket.on('connect', onConnect);
      socket.on('disconnect', () => {
        console.log("Socket bị ngắt kết nối");
      });
        // Cleanup sự kiện khi component unmount
      return () => {
        socket?.off('connect', onConnect);
        socket?.off('disconnect');
        socket?.off('receiveMessage');
      };
  }
  , [socket, currentUserId]);

  //fetch tin nhắn với pagination
  useEffect(() => {
    if(currentUserId && selectedUserId && page > 1){
      fetchMessages(currentUserId, selectedUserId, page);
    }
  }, [page, currentUserId, selectedUserId]);

  //gửi tin nhắn
  const sendMessage = () => {
    if (selectedUserId && newMessage.trim() && socket?.connected) {
      socket?.emit('sendMessage', {
        receiverId: selectedUserId,
        content: newMessage
      });
      console.log("message gửi đi: ", newMessage);
      //thêm tin nhắn vào danh sách hiển thị tạm thời (người gửi)
      setMessage((prevMessages) => [
        ...prevMessages,
        {
          content: newMessage,
          own: true,
          avarta: avarta ?? 'https://www.gravatar.com/avatar/?d=mp',
          time: new Date().toISOString(),
        },
      ]);
      setNewMessage(''); //Reset phần nhập message mới
    }
  };

  


  return (<>
    <div className={`chat-notification ${isOpen ? 'open' : ''}`}>
      <div className="chat-header">
        <div className="chatHeaderWrapper">
          <img src={selectedUserInfo?.avarta} alt="User Avatar" className="user-avatar" />
          <span>{selectedUserInfo?.name}</span>
        </div>
        <button className="close-btn" onClick={handleCloseChat}>
          <img src={IconClose} alt="close"/>
        </button>
      </div>
      <div className="chat-body">
        <div className="chatBodyWapper" id="chatBodyWapper">
          <InfiniteScroll
            dataLength={message.length}
            next={() => {
              if(!loading && hasMore){
                setTimeout(() => {
                  setPage(prevPage => prevPage + 1);
                }, 1000);
              }
            }}
            hasMore={hasMore}
            loader={<p style={{textAlign: 'center'}}>Loading...</p>}
            inverse={true}
            scrollableTarget="chatBodyWapper"
            style={{ display: 'flex', flexDirection: 'column-reverse' }}
          >
            {Array.isArray(message) && message.length > 0 ? (
              [...message].reverse().map((msg, index) => (
                <MessageNotification
                  key={`msg-${index}`}
                  own={msg.own}
                  content={msg.content}
                  avarta={msg.avarta ?? 'https://www.gravatar.com/avatar/?d=mp'}
                  time={msg.time}
                />
              ))
            ) : (
              <p>No messages</p>
            )}
          </InfiniteScroll>
        </div>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          />
        <button className="chatSubmit" onClick={sendMessage}>Send</button>
      </div>
    </div>
  </>);
};
export default ChatNotificationModal;