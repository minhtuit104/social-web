import Avartar from "../assets/images/tu.jpg";
import IconNew from "../assets/images/icons/ic_news.svg";
import IconMessage from "../assets/images/icons/ic_message.svg";
import IconFriend from "../assets/images/icons/ic_friends.svg";
import IconNotting from "../assets/images/icons/ic_notifications.svg";
import IconSetting from "../assets/images/icons/ic_setting.svg";
import "../assets/css/nav_bar.css";
import { NavDropdown } from 'react-bootstrap';
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { fectchUserName } from "../services/UserService";
import ModalNotification from "../components/modal_notification";
import ModalFriends from "../components/modalFriends/modal_friends";
import { useUser } from "../components/UserContext/UserContext";
import { useWebSocket } from "../WebSocket/WebSocketProvider";
import ModalDetailPost from "../components/modal_detail_post/Modal_detail_post";

const NavBar = () => {
    const { userAvatar } = useUser();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('');
    const [userName, setUserName] = useState<string | null>(null);
    const [emailInfo, setEmailInfo] = useState<string | null>(null);
    const [avarta, setAvarta] = useState<string | null>(null);
    const [showModalNotification, setShowModalNotification] = useState(false);//hiển thị modal thông báo
    const [showModalFriends, setShowModalFriends] = useState(false);//hiển thị modal bạn bè
    const socket = useWebSocket();
    const [messageCount, setMessageCount] = useState(0);
    const [notificationCount, setNotificationCount] = useState(0);
    const [friendRequestCount, setFriendRequestCount] = useState(0);
    const [showDetailPost, setShowDetailPost] = useState(false);
    const [selectedPost, setSelectedPost] = useState<any>(null);

    
    useEffect(() => {
        if(socket){
            socket.on('receiveMessage', (data) => {
                setMessageCount(prevCount => prevCount + 1);
            }); 
            socket.on('receiveNewComment', (data) => {
                setNotificationCount(prevCount => prevCount + 1);
            });
            socket.on('receiveNewEmotion', (data) => {
                setNotificationCount(prevCount => prevCount + 1);
            });
            socket.on('receiveFriendRequest', (data) => {
                setFriendRequestCount(prevCount => prevCount + 1);
            });
        }

        return () => {
            if(socket){
                socket.off('receiveMessage');
                socket.off('receiveNewComment');
                socket.off('receiveNewEmotion');
                socket.off('receiveFriendRequest');
            }
        }
    }, [socket]);

    
    const toggleModalFriends = () => {
        setShowModalFriends(!showModalFriends);
        //Reset lại số lượng bạn bè khi mở modal
        if(!showModalFriends){
            setFriendRequestCount(0);
        }
    }
    const handleShowPost = (postData: any) => {
        setSelectedPost(postData);
        setShowDetailPost(true);
    }
    //hàm hiển thị đóng mở modal thông báo
    const toggleModalNotification = () => {
        setShowModalNotification(!showModalNotification);
        //Reset lại số lượng thông báo khi mở modal
        if(!showModalNotification){
            setNotificationCount(0);
        }
    }

    //hàm giải mã token
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

    //kết nổi từ idUser lấy ra từ token để hiển thị UserName
    const user = getUserFromToken();
    const idUser = user?.idUser;
    useEffect(() => {
    const getUser = async () =>{
        if(idUser){
            try {
                const userData = await fectchUserName(idUser);
                if(userData){
                setUserName(userData.name);
                setEmailInfo(userData.email);
                setAvarta(userData.avarta);
            }
            } catch (error) {
                console.error('Failed to fetch user name:', error);
            }
        }
    };
    getUser();
    },[idUser]);


//------------------------
    useEffect(() => {
        if(location.pathname === "/home"){
            setActiveTab("new-feed");
        }
        if(location.pathname === "/home/messager"){
            setActiveTab("message");
        }
    }, [location]);

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
        toast.success("Logout success!")
    }
    const handleProfile = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        navigate(`/profile/${idUser}`);
    }
    const handleMessage = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        //Reset lại số lượng tin nhắn khi chuyển đến trang messager
        setMessageCount(0);
        navigate("/home/messager");
    }

    return (<>
    <div className="nav-side-bar">
        <div className="profile">
            <div className="profile-image">
                <a href="/home/profile" onClick={handleProfile}><img src={userAvatar ?? avarta ?? 'https://www.gravatar.com/avatar/?d=mp' } alt="Profile Image" /></a>
            </div>
            <h3>{userName ?? 'Loading...'}</h3>
            <p>{emailInfo ?? 'Loading...'}</p>
        </div>
        <nav>
            <ul>
                <li className={activeTab === "new-feed" ? "active" : ""}><a href="/home"><img src={IconNew} alt="" className="ic-22" />News Feed</a></li>
                <li className={activeTab === "message" ? "active" : ""}><a href="/home/messager" onClick={handleMessage}><img src= {IconMessage} alt="" className="ic-22" />Messages</a>
                    {messageCount > 0 && <span className="quantity">{messageCount}</span>}
                </li>
                <li><a href="#" onClick={toggleModalFriends}><img src= {IconFriend} alt="" className="ic-22" />Friends</a>
                    {friendRequestCount > 0 && <span className="quantity">{friendRequestCount}</span>}
                </li>
                <li><a href="#" onClick={toggleModalNotification}><img src= {IconNotting} alt="" className="ic-22" />Notifications</a>
                    {notificationCount > 0 && <span className="quantity">{notificationCount}</span>}
                </li>
                <li>
                    <img src= {IconSetting} className="ic-22 icSetting" alt="Settings" />
                    <NavDropdown title="Settings" className="DropdownSetting" style={{marginLeft: '-13px'}}>
                        <NavDropdown.Item href="#" onClick={handleProfile}>Profile</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => handleLogout()}>Logout</NavDropdown.Item>
                    </NavDropdown>
                </li>
            </ul>
        </nav>  
                     
    </div>
    {showModalNotification && (
        <ModalNotification 
        show={showModalNotification} 
        handleClose={() => setShowModalNotification(false)}
        onShowPost={handleShowPost}/>
    )}
    {showModalFriends && (
        <ModalFriends 
        show={showModalFriends} 
        handleClose={toggleModalFriends} />
    )}

    {selectedPost && (
        <ModalDetailPost 
            show={showDetailPost}
            handleClose={() => {setShowDetailPost(false); setSelectedPost(null);}}
            idPost={selectedPost.idPost}
            title={selectedPost.title}
            privacy={selectedPost.privacy}
            createAt={selectedPost.createAt}
            image={selectedPost.image}
            updateCommentCount={() => {}}
        />
    )}
    </>);
}

export default NavBar;