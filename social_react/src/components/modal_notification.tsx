import IconClose from "../assets/images/icons/ic_close.svg";
import "../assets/css/modal_notification.css";
import { useEffect, useRef, useState } from "react";
import NotificationItem from "./notification_item/Notification_item";
import fetchNotificationsByIdUser from "../services/NotificationService";

const ModalNotification = ({handleClose}: any) => {
    const Ref = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [notifications, setNotifications] = useState<any[]>([]);

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

    useEffect(() => {
        const fetchNotifications = async () => {
            if(idUser){
                setLoading(true);
                try {
                    const data = await fetchNotificationsByIdUser(idUser);
                    console.log('danh sach thong bao nhan duoc:',data);
                    setNotifications(data);
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchNotifications();
    }, [idUser]);
    

    //hàm đóng modal khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (Ref.current && !Ref.current.contains(event.target as Node)) {
                handleClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClose]);

    return (
        <>
        <div ref={Ref} className="notification">
            <div className="notification-header">
                <span>Notifications</span>
                <button onClick={handleClose}><img src={IconClose} alt="close" className="ic-22" /></button>
            </div>
            <div className="notification-content">
                <div className="notification-list">
                {notifications.map((notification: any) => (
                    <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                    />
                ))}
                </div>
            </div>
        </div>
        </>
    );
};

export default ModalNotification;