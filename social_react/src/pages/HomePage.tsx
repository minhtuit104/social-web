import NavBar from "../layouts/NavBar";
import RightBar from "../layouts/RightBar";
import FeedPage from "./FeedPage";
import "../assets/css/home_page.css";
import { useWebSocket} from "../WebSocket/WebSocketProvider";
import ChatNotificationModal from "../components/chatNotificationModal/ChatNotificationModal";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { EmotionProvider, useEmotion } from "../components/UserContext/EmotionByUserContext";
import { ChatProvider } from "../components/UserContext/ChatContext";

const HomePageContent = () => {
  const { socket, isConnected } = useWebSocket();
  const { setReactions } = useEmotion();

  useEffect(() => {
    if (!socket || !isConnected) {
      return;
    }

    console.log("Socket connected in HomePage");

    socket.on('connect', () => {
      console.log("socket đã kết nối: ", socket.connected);
    });
    
    socket.on('disconnect', () => {
      console.log("socket đã bị ngắt kết nối");
    });

    socket.on('receiveNewComment', (data) => {
      console.log('Nhận được bình luận mới: ', data);
      //hiển thị thông báo bình luận mới
      toast.info(`${data.author} đã bình luận vào bài viết của bạn`);
    });

    socket.on('receiveNewEmotion', (data) => {
      console.log('Nhận được cảm xúc mới: ', data);
      setReactions(prev => ({
        ...prev, 
        [data.idPost]: data.emotion
      }));
      //hiển thị thông báo cảm xúc mới
      toast.info(`${data.author} đã bày tỏ cảm xúc về bài viết của bạn`);
    });

    socket.on('receiveFriendRequest', (data) => {
      console.log('Nhận được lời mời kết bạn mới: ', data);
      //hiển thị thông báo lời mời kết bạn mới
      toast.info(`${data.sender.name} đã gửi cho bạn lời mời kết bạn`);
    });

    return () => {
      socket.off('receiveNewComment');
      socket.off('receiveNewEmotion');
      socket.off('receiveFriendRequest');
    };
  }, [socket, setReactions, isConnected]);
      
  return (<>
    <ChatProvider socket={socket}>
      <div className="homepage">
        <NavBar />           
        <FeedPage />        
        <RightBar socket={socket}/> 
      </div>
    </ChatProvider>
  </>);
}

const HomePage = () => {
    return(
      <EmotionProvider>
        <HomePageContent />
      </EmotionProvider>
    );
}

export default HomePage;