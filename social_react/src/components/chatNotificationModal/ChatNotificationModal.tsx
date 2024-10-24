import { useEffect, useState } from "react";
import "./chatNotificationModal.css";
import MessageNotification from "./MessageNotification";
import { getMessageWithUser } from "../../services/MessageService";
import { fectchUserName } from "../../services/UserService";
import IconClose from "../../assets/images/icons/ic_close.svg";
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
  
  const userInfo = getUserFromToken();
  const currentUserId = userInfo?.idUser;

  useEffect(() => {
    const getUser = async () => {
      if (currentUserId) {
        const userData = await fectchUserName(currentUserId);
        setAvarta(userData?.avarta);
      }
    };
    getUser();
  }, [currentUserId]);
  // Đóng cửa sổ chat
  const handleCloseChat = () => setIsOpen(false);

  useEffect(() => {
    if (!socket) {
      console.warn("Socket is null or undefined");
      return;
    }
  }, [socket]);

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
          setSelectedUserId(message.sender.idUser); //lưu id của người gửi tin nhắn tới

          //lưu thông tin người gửi tin nhắn vào state
          setSelectedUserInfo({
            avarta: message.sender.avarta ?? 'https://www.gravatar.com/avatar/?d=mp',
            name: message.sender.name,
          });

          setIsOpen(true); //mở cửa sổ chat

          //gọi api lấy tin nhắn với người nhận
          const res = await getMessageWithUser(currentUserId, message.sender.idUser);
          if(res && res.data && res.data.length > 0){
            const updateMessage = res.data.map((msg: any) => ({
              ...msg,
              own: msg.sender.idUser === currentUserId,
              time: msg.createAt,
              avarta: msg.sender.avarta ?? 'https://www.gravatar.com/avatar/?d=mp',
            }));
            setMessage([
              ...updateMessage,
              // {
              //   avarta: message.sender.avarta ?? 'https://www.gravatar.com/avatar/?d=mp',
              //   content: message.content,
              //   own: false,
              //   time: new Date(message.createAt).toISOString(),
              // }
            ]);
          } else {
            setMessage([
              {
                avarta: message.sender.avarta ?? 'https://www.gravatar.com/avatar/?d=mp',
                content: message.content,
                own: false,
                time: new Date(message.createAt).toISOString(),
              }
            ]);
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
        <div className="chatBodyWapper">
          {Array.isArray(message) && message.length > 0 ? (
            message.map((msg, index) => (
              <MessageNotification
                key={index}
                own={msg.own}
                content={msg.content}
                avarta={msg.avarta ?? 'https://www.gravatar.com/avatar/?d=mp'}
                time={msg.time}
              />
            ))
          ) : (
            <p>No messages</p>
          )}
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