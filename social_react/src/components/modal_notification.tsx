import IconClose from "../assets/images/icons/ic_close.svg";
import "../assets/css/modal_notification.css";
import { useEffect, useRef, useState } from "react";
import NotificationItem from "./notification_item/Notification_item";
import fetchNotificationsByIdUser from "../services/NotificationService";
import 'animate.css';
import ModalDetailPost from "./modal_detail_post/Modal_detail_post";
import InfiniteScroll from "react-infinite-scroll-component";

interface ModalNotificationProps {
    show: boolean;
    handleClose: () => void;
    onShowPost: (postData: any) => void; //thêm props mới để xử lý hiển thị post
}

const ModalNotification: React.FC<ModalNotificationProps> = ({show, handleClose, onShowPost}) => {
    const Ref = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isClosing, setIsClosing] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [paginationInfo, setPaginationInfo] = useState<any>(null);
    // const [selectPost, setSelectPost] = useState<any>(null);
    // const [showDetailPost, setShowDetailPost] = useState(false);

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
    
    const userInfo = getUserFromToken();
    const idUser = userInfo?.idUser;


    const loadNotifications = async () => {
        if(!loading){
            return;
        };

        try{
            setLoading(true);
            const response = await fetchNotificationsByIdUser(idUser, page);

            if(response && response.data){
                const { data: { data: newNotifications, pagination } } = response;

                if(page === 1){
                    console.log('Danh sach thong bao:', newNotifications);
                    setNotifications(newNotifications);
                } else {
                    setNotifications(prevNotifications => [...prevNotifications, ...newNotifications]);
                }
                setPaginationInfo(pagination);
                setHasMore(page < pagination.last_page);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, [idUser, page]);

    //hàm load thêm thông báo
    const loadMoreNotifications = () => {
        if(loading || !hasMore) return;
        setTimeout(() => {
            setPage(prev => prev + 1);
        }, 1000);
    }

    const handleCloseWithAnimation = () => {
        setIsClosing(true);
        setTimeout(() => {
            handleClose();
        }, 500);
    };

    const handleNotificationClick = (notification: any) => {
        if(notification.post){
            const postData = {
                idPost: notification.post.idPost,
                title: notification.post.title,
                privacy: notification.post.privacy,
                createAt: notification.post.createAt,
                image: notification.post.image,
            };
            onShowPost(postData);

            handleCloseWithAnimation();
        }
    }

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

    return (
        <>
        <div 
            ref={Ref} 
            className={`notification animate__animated ${
                isClosing ? 'animate__slideOutRight' : 'animate__slideInRight'}`}>
            <div className="notification-header">
                <span>Notifications</span>
                <button onClick={handleCloseWithAnimation}><img src={IconClose} alt="close" className="ic-22" /></button>
            </div>
            <div className="notification-content">
                <InfiniteScroll
                    dataLength={notifications.length}
                    next={loadMoreNotifications}
                    hasMore={hasMore}
                    loader={<div className="loading-indicator" style={{textAlign: 'center'}}>Loading more...</div>}
                    endMessage={<div className="end-message" style={{textAlign: 'center'}}>No more notifications</div>}
                >
                    {loading ? (
                        <div className="loading-indicator">Đang tải thông báo...</div>
                    ) : notifications.length > 0 ? (
                        <div className="notification-list">
                            {notifications.map((notification: any) => (
                                <NotificationItem 
                                    key={notification.id} 
                                    notification={notification} 
                                    onNotificationClick={handleNotificationClick}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="no-notifications">Không có thông báo nào.</div>
                    )}
                </InfiniteScroll>
            </div>
        </div>

        </>
    );
};

export default ModalNotification;