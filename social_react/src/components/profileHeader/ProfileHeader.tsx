import "./profileHeader.css";
import ImgCover from "../../assets/images/anh4.jpg";
import ImgLocation from "../../assets/images/icons/ic_location.svg";
import ImgFollow from "../../assets/images/icons/ic_friendss.svg";
import IconCamera from "../../assets/images/icons/ic_camera.svg";
import { useEffect, useState } from "react";
import { fectchUserName } from "../../services/UserService";
import ImgAddFriend from "../../assets/images/icons/ic_addfriend.svg";
import { cancelFriendRequest, checkFriendshipStatus, deleteFriend, sendFriendRequest } from "../../services/FriendService";
import ModalUpdateAvatar from "./modal_updateAvatar";
import { useWebSocket } from "../../WebSocket/WebSocketProvider";

interface ProfileHeaderProps {
    idUser: number | undefined;
}

//hàm giải mã token lấy idUser
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


const ProfileHeader: React.FC<ProfileHeaderProps> = ({idUser}) => {
    const { socket, isConnected } = useWebSocket();
    const [avarta, setAvarta] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [friendshipStatus, setFriendshipStatus] = useState<string>('not_friend');
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [showModalUpdateAvatar, setShowModalUpdateAvatar] = useState(false);

    const userInfo = getUserFromToken();
    const currentId = userInfo?.idUser;

    useEffect(() => {
        setCurrentUserId(currentId);
    }, []);

    //hàm lấy thông tin user
    useEffect(() => {
        const getUser = async () => {
            if(idUser){
                try {   
                    const userData = await fectchUserName(idUser);
                    const status = await checkFriendshipStatus(idUser);
                    if(userData){
                        setAvarta(userData.avarta);
                        setName(userData.name);
                        setFriendshipStatus(status);
                        // console.log('userData===', userData);
                    }
                } catch (error) {
                    console.error('Failed to fetch user name:', error);
                } finally {
                    setIsLoading(false);
                }
            }

        };
        getUser();
    },[idUser])

    //hàm gửi lời mời kết bạn
    const handleAddFriend = async () => {
        if(idUser){
            try {
                if(socket && isConnected){
                    socket.emit('addFriend', {
                        idUser: idUser
                    });
                } else {
                    await sendFriendRequest(idUser);
                }
                
                setFriendshipStatus('pending'); //cập nhật trạng thái kết bạn thành công
            } catch (error) {
                console.error('Failed to send friend request:', error);
            }
        }
    }

    //hàm hủy yêu cầu kết bạn
    const handleCancelFriendRequest = async () => {
        if(idUser){
            try {
                await cancelFriendRequest(idUser);
                setFriendshipStatus('not_friend');
            } catch (error) {
                console.error('Failed to cancel friend request:', error);
            }
        }
    }

    //hàm xóa bạn bè
    const handleDeleteFriend = async () => {
        if(idUser){
            const confirm = window.confirm('Are you sure you want to delete this friend?');
            if(confirm){
                try {
                    await deleteFriend(idUser);
                    setFriendshipStatus('not_friend');
                } catch (error) {
                    console.error('Failed to delete friend:', error);
                }
            }
        }
    }

    //hàm hiển thị nút kết bạn
    const renderFriendButton = () => {
        //kiểm tra nếu đang xem profile của chính mình thì không hiển thị nút kết bạn
        if(currentUserId === idUser){
            return null;
        }
        switch(friendshipStatus) {
            case 'accepted':
                return (
                    <div className="profileHeader-BtnGroup">
                        <button className="profileHeader-Btn">
                            <img src={ImgFollow} alt="Friend" className="ic-18" />
                            Friend
                        </button>
                        <button 
                            className="profileHeader-Btn profileHeader-Btn-Cancel"
                            onClick={handleDeleteFriend}
                        >
                            Unfriend
                        </button>
                    </div>
                );
            case 'pending':
                return (
                    <div className="profileHeader-BtnGroup">
                        <button className="profileHeader-Btn" disabled>
                            <img src={ImgAddFriend} alt="Pending" className="ic-18" />
                            Request Sent
                        </button>
                        <button 
                            className="profileHeader-Btn profileHeader-Btn-Cancel"
                            onClick={handleCancelFriendRequest}
                        >
                            Cancel Request
                        </button>
                    </div>
                );
            default:
                return (
                    <button 
                        className="profileHeader-Btn"
                        onClick={handleAddFriend}
                    >
                        <img src={ImgAddFriend} alt="Add friend" className="ic-18" />
                        Add new friend
                    </button>
                );
        }
    }

    const handleClose = () => {
        setShowModalUpdateAvatar(false);
    }

    const handleAvatarUpdate = (newAvatar: string) => {
        setAvarta(newAvatar);
    }


    if(isLoading){
        return <div>Loading...</div>;
    }


    return (<>
        <div className="profileHeader">
            <div className="profileHeader-Cover">
                <img src={ImgCover} alt="" className="profileHeader-CoverImg" />
                <img src={avarta ?? 'https://www.gravatar.com/avatar/?d=mp' } alt="Profile Image" className="profileHeader-AvatarImg" />
            </div>
            <div className="profileHeader-Info">
                <div className="profileHeader-Info-Top">
                    <h4 className="profileHeader-Name">{name}</h4>
                    <span className="profileHeader-Desc">Hello everyone</span>
                    <span className="profileHeader-Location"><img src={ImgLocation} alt="Location" className="ic-18" />Hà Nội, Việt Nam</span>
                    <div className="profileHeader-Follow"><img src={ImgFollow} alt="Follow" className="ic-18" />3,2tr follower</div>
                </div>
                <div className="profileHeader-Info-Bottom">
                    {renderFriendButton()}
                </div>
                { currentUserId === idUser && (
                    <div className="update-avatar-btn">
                        <button onClick={() => setShowModalUpdateAvatar(true)}><img src={IconCamera} alt="Edit" className="ic-18" /></button>
                    </div>
                )}
            </div>
            <ModalUpdateAvatar
                show = {showModalUpdateAvatar}
                handleClose = {handleClose}
                onAvatarUpdate = {handleAvatarUpdate}
            />
        </div>
        
    </>);
}

export default ProfileHeader;
