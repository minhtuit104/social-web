import NavBar from "../layouts/NavBar";
import RightBar from "../layouts/RightBar";
import FeedPage from "./FeedPage";
import "../assets/css/home_page.css";
import { useWebSocket } from "../WebSocket/WebSocketProvider";
import ChatNotificationModal from "../components/chatNotificationModal/ChatNotificationModal";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
const HomePage = () => {
    const socket = useWebSocket();
    useEffect(() => {
        if (socket) {
          socket.on('connect', () => {
            console.log("socket đã kết nối: ", socket?.connected);
          });
    
          socket.on('disconnect', () => {
            console.log("socket đã bị ngắt kết nối");
          });

          socket.on('receiveNewComment', (data) => {
            console.log('Nhận được bình luận mới: ', data);
            //hiển thị thông báo bình luận mới
            toast.info(`${data.author} đã bình luận vào bài viết của bạn`);
          });

        }

        return () => {
          socket?.off('receiveNewComment');
        };
      }, [socket]);
      
    return (<>
        <div className="homepage">
                <NavBar />           
                <FeedPage />        
                <RightBar />      
                <ChatNotificationModal socket={socket}/>
        </div>
    </>);
}

export default HomePage;