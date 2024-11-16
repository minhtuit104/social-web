import { useEffect, useRef, useState } from "react";
import IconClose from "../../assets/images/icons/ic_close.svg";
import { acceptFriendRequest, getFriendRequest, getFriends, rejectFriendRequest } from "../../services/FriendService";
import "../../assets/css/modal_notification.css";
import FriendRequest from "./FriendRequest";
import FriendItem from "./Friend_item";
import 'animate.css';
import InfiniteScroll from "react-infinite-scroll-component";

const ModalFriends = ({handleClose}: any) => {
    const Ref = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [friends, setFriends] = useState<any[]>([]);
    const [friendRequest, setFriendRequest] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [paginationInfo, setPaginationInfo] = useState<any>(null);

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

    const userInfo = getUserFromToken();
    const idUser = userInfo?.idUser;

    const [isClosing, setIsClosing] = useState<boolean>(false);

    const handleCloseWithAnimation = () => {
        setIsClosing(true);
        setTimeout(() => {
            handleClose();
        }, 500);
    };

    //hàm đóng modal khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (Ref.current && !Ref.current.contains(event.target as Node)) {
                handleCloseWithAnimation();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClose]);

    const fetchFriendRequest = async () => {
        try {
            const response = await getFriendRequest(page);

            if(response && response.data){
                const { data: { data: newFriendRequest, pagination } } = response;

                if(page === 1){
                    setFriendRequest(newFriendRequest);
                } else {
                    setFriendRequest(prevFriendRequest => [...prevFriendRequest, ...newFriendRequest]);
                }
                setPaginationInfo(pagination);
                setHasMore(page < pagination.last_page);
            }
        } catch (error) {
            console.error('Error fetching friend request:', error);
        } finally {
            setLoading(false);
        }
    }

    //hàm lấy danh sách lời mời kết bạn đã nhận
    useEffect(() => { 
        fetchFriendRequest();
    }, [idUser, page]);

    //hàm chấp nhận lời mời kết bạn
    const handleAcceptFriend = async (friendId: number) => {
        try {          
            await acceptFriendRequest(friendId);
            // tìm thông thi người dùng từ danh sách lời mời
            const acceptFriend = friendRequest.find((req: any) => req.user.idUser === friendId);
            console.log('thong tin lời mời:', acceptFriend);
            //cập nhật lại state khi chấp nhận lời mời kết bạn
            setFriendRequest((prevFriendRequests: any) => prevFriendRequests.filter((req: any) => req.user.idUser !== friendId));

            //thêm bạn bè vào danh sách bạn bè
            if(acceptFriend){
                const newFriends = {
                    idUser: acceptFriend.user.idUser,
                    name: acceptFriend.user.name,
                    avarta: acceptFriend.user.avarta,
                    email: acceptFriend.user.email,
                };
                setFriends((prevFriends: any) => [newFriends, ...prevFriends]);
            }
        } catch (error) {
            console.error('Lỗi khi chấp nhận lời mời kết bạn:', error);
        }
    };

    //hàm từ chối lời mời kết bạn
    const handleDeclineFriend = async (friendId: number) => {
        try {
            await rejectFriendRequest(friendId);
            console.log('từ chối lời mời kết bạn thành công');
            //cập nhật lại state khi từ chối lời mời kết bạn
            setFriendRequest((prevFriendRequests: any) => prevFriendRequests.filter((friend: any) => friend.user.idUser !== friendId));
        } catch (error) {
            console.error('Lỗi khi từ chối lời mời kết bạn:', error);
        }
    };

    //hàm lấy danh sách bạn bè
    const fetchFriends = async () => {
        if(!loading){
            console.log('lỗi ở đây...');
            return;
        }
        try {
            const response = await getFriends();

            if(response && response.data){
                const { data: { data: newFriends, pagination } } = response;

                if(page === 1){
                    setFriends(newFriends);
                } else {
                    setFriends(prevFriends => [...prevFriends, ...newFriends]);
                }
                setPaginationInfo(pagination);
                setHasMore(page < pagination.last_page);
            }
        } catch (error) {
            console.error('Error fetching friends:', error);
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        fetchFriends();
    }, [idUser, page]);

    const handleLoadMore = () => {
        if(loading || !hasMore) return;
        setTimeout(() => {
            setPage(prevPage => prevPage + 1);
        }, 1000);
    }

    return (<>
        <div 
            ref={Ref} 
            className={`notification animate__animated ${
                isClosing ? 'animate__slideOutRight' : 'animate__slideInRight'}`}>
            <div className="notification-header">
                <span>Danh sách bạn bè</span>
                <button onClick={handleCloseWithAnimation}><img src={IconClose} alt="close" className="ic-22" /></button>
            </div>
            <div className="notification-content">
                <h3>Friend requests:</h3>
                    <InfiniteScroll
                        dataLength={friendRequest.length}
                        next={handleLoadMore}
                        hasMore={hasMore}
                        loader={<div className="loading-indicator" style={{textAlign: 'center'}}>loading...</div>}
                    >
                        {loading ? (
                            <div className="loading-indicator">Đang tải thông báo...</div>
                        ) : friendRequest && friendRequest.length > 0 ? (
                            <div className="notification-list">
                                {friendRequest.map((friend: any) => (
                                    <FriendRequest 
                                        key={`friend_request-${friend.user.idUser}`} 
                                        friend={friend} 
                                        onAccept={() => handleAcceptFriend(friend.user.idUser)}
                                        onDecline={() => handleDeclineFriend(friend.user.idUser)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="no-notifications">No friend requests.</div>
                        )}
                    </InfiniteScroll>
                <h3>List friends:</h3>
                <InfiniteScroll
                    dataLength={friends.length}
                    next={handleLoadMore}
                    hasMore={hasMore}
                    loader={<div className="loading-indicator" style={{textAlign: 'center'}}>loading...</div>}
                >
                    {loading ? (
                        <div className="loading-indicator">Đang tải bạn bè...</div>
                    ) : friends && friends.length > 0 ? (
                        <div className="notification-list">
                            {friends.map((friend: any) => (
                                <FriendItem 
                                    key={`friend_item-${friend.idUser}`} 
                                    friend={friend} 
                                />
                            ))}
                        </div>
                        ) : (
                        <div className="no-notifications">No friends.</div>
                    )}
                </InfiniteScroll>
            </div>
        </div>
    </>);
}

export default ModalFriends;