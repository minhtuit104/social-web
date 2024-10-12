import { useEffect, useState } from "react";
import "../assets/css/messager.css";
import IconSearch from "../assets/images/icons/ic_search.svg";
import ChatOnline from "../components/chatOnline/ChatOnline";
import Conversation from "../components/Conversation/Conversation";
import Message from "../components/message/Message";
import NavbarMessager from "../components/navbarMessager/NavbarMessager";
import { fetchAllUser } from "../services/UserService";
import { useWebSocket } from "../WebSocket/WebSocketProvider";
import { getMessageWithUser } from "../services/MessageService";


//hàm giải mã lấy idUser
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


const Messeager = () => {
    const socket = useWebSocket();
    const [user, setUser] = useState([]); //khởi tạo danh sách user
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null); //lưu idUser của ngyời nhận
    const [selectedUserInfo, setSelectedUserInfo] = useState<any>(null); //lưu thông tin của người nhận
    const [message, setMessage] = useState<any[]>([]); //lưu message
    const [newMessage, setNewMessage] = useState<string>(''); //lưu message mới

    const userInfo = getUserFromToken();
    const currentUserId = userInfo?.idUser;


    const sendMessage = () => {
        if(selectedUserId && newMessage.trim() && socket?.connected){
            socket?.emit('sendMessage',{
                receiverId: selectedUserId,
                content: newMessage
            });
            console.log("message gửi: ", newMessage);
            //thêm tin nhắn vào danh sách hiển thị tạm thời (người gửi)
            setMessage((prevMessages) => [
                ...prevMessages,
                {
                    content: newMessage,
                    own: true,
                    avarta: userInfo?.avarta ?? 'https://www.gravatar.com/avatar/?d=mp',
                    time : new Date().toISOString(),
                },
            ]);
            setNewMessage(''); //Reset phần nhập message mới
        }
    };
    //lắng nghe sự kiện nhận tin nhắn từ socket
    useEffect(() => {
        if(socket && socket.connected){
            socket?.on('receiveMessage', (message) => {
                console.log("message nhận: ", message);
                setMessage((prevMessages) => [
                    ...prevMessages,
                    { 
                        avarta: message.sender.avarta ?? 'https://www.gravatar.com/avatar/?d=mp',
                        content: message.content,
                        own: false,
                        time: new Date(message.createAt).toISOString(),

                    }]);
        });
        // Cleanup sự kiện khi component unmount
        return () => {
            socket?.off('receiveMessage');
        };     
    }
    }, [socket]);

    //khi user tham gia room
    useEffect(() => {
        if (socket && socket.connected && currentUserId) {
            // Gửi sự kiện joinRoom khi socket kết nối
            socket.emit('joinRoom', currentUserId);
    
            // Cleanup khi component unmount hoặc khi socket ngắt kết nối
            return () => {
                socket.emit('leaveRoom', currentUserId); // Hoặc xử lý logic rời khỏi room nếu cần
            };
        }
    }, [socket, currentUserId]);
    
    //gọi API lấy danh sách user
    useEffect(() => {
        getUser();
    }, [])

    const getUser = async () => {
        try {
            const res = await fetchAllUser();
            if(res && res.data){
                setUser(res.data);
                console.log("Danh sách user:", res.data);
            } else {
                console.error("No user data not found");
            }
        } catch (error) {
            console.error('Failed to fetch user name:', error);
        }
    };

    //hàm chọn người nhận
    const handleSelectUserId = async (idUser: number) => {
        setSelectedUserId(idUser);
        console.log("idUser người nhận---------->: ", selectedUserId);
        //lấy thông tin người nhận
        const selectUser = user.find((user: any) => user.idUser === idUser);
        setSelectedUserInfo(selectUser);
        // console.log("selectUserInfo---------->: ", selectUser);
        try {
            const res = await getMessageWithUser(currentUserId, idUser);
            // console.log("res---------->: ", res?.data);
            if(res && res.data && res.data.length > 0){
                const updateMessage = res.data.map((msg: any) => ({
                    ...msg,
                    own: msg.sender.idUser === currentUserId,
                    time: msg.createAt,
                    avarta: msg.sender.avarta ?? 'https://www.gravatar.com/avatar/?d=mp',
                }));
                setMessage(updateMessage);
                // console.log("message với người nhận---->: ", updateMessage);
            } else {
                setMessage([]);
            }
        } catch (error) {
            console.error('Failed to fetch message:', error);
        }
    };
    

  return (<>
    <NavbarMessager />
    <div className="messager">
        <div className="chatMenu">
            <div className="chatMenuWrapper">
                <img src={IconSearch} alt="" className="ic-22 ic-search" />
                <input type="text" placeholder="Search for friends" className="chatMenuInput" />
                {/* Map qua danh sách user và render Conversation */}
                {user.map((user: any) => (
                    <Conversation 
                    key={user.idUser} 
                    user={user} 
                    onClick={() => handleSelectUserId(user.idUser)}
                    isSelected={selectedUserId === user.idUser} /> //kiểm tra xem user có được chọn hay không
                ))}
            </div>
        </div>
        <div className="chatBox">
            <div className="chatBoxWrapper">
                <div className="chatBoxTop">
                    {Array.isArray(message) && message.length > 0 ? (
                        message.map((msg, index) => (
                            <Message 
                                key={index} 
                                own={msg.own} 
                                content={msg.content} 
                                avarta={msg.avarta ?? 'https://www.gravatar.com/avatar/?d=mp'} 
                                time={msg.time}
                            />
                    ))
                ): (
                    <p>No messages</p>
                )}
                </div>
                <div className="chatBoxBottom">
                    <textarea 
                    className="chatMessageInput" 
                    placeholder="write something..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}></textarea>
                    <button className="chatSubmitButton" onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
        <div className="chatOnline">
            <div className="chatOnlineWrapper">
                {selectedUserInfo && (
                    <ChatOnline 
                        name={selectedUserInfo.name} 
                        avarta={selectedUserInfo.avarta ?? 'https://www.gravatar.com/avatar/?d=mp'} 
                    />
                )}
            </div>
        </div>
    </div>
    </>)
}

export default Messeager;