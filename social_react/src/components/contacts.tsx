
import { useEffect, useState } from "react";
import "../assets/css/right_bar.css";
import ContactsItem from "./contacts/Contacts_item";
import { getFriends } from "../services/FriendService";
import { useChat } from "./UserContext/ChatContext";

interface ContactsProps {
    socket: any;
}

const Contacts = ({socket}: ContactsProps) => {
    const [friends, setFriends] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [paginationInfo, setPaginationInfo] = useState<any>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);

    const { openChat } = useChat();


    // lấy danh sách bạn bè
    const fetchFriends = async () => {
        if(loading){
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
    }, [page]);

    //hàm xử lý khi mở cửa sổ chat
    const handleOpenChat = (friend: any) => {
        if(!socket?.connected){
            console.log("socket not available");
            return;
        }
        const chatData = {
            idUser: friend.idUser,
            avarta: friend.avarta || 'https://www.gravatar.com/avatar/?d=mp',
            name: friend.name,
        };
        console.log("Emit open chat with user: ", chatData);
        openChat(chatData);

        socket.emit('openChat', chatData);
    };

    return (<>
            <div className="right-sidebar">
                <div className="contacts">
                    <h3>Contacts</h3>
                    {loading ? (
                        <div className="loading-indicator">Đang tải bạn bè...</div>
                    ) : friends && friends.length > 0 ? (
                    <div className="contact-list">
                        {friends.map((friend: any) => (
                            <ContactsItem 
                                key={`contact_item-${friend.idUser}`} 
                                friend={friend} 
                                onClick={() => handleOpenChat(friend)}
                            />
                            ))}
                        </div>
                    ) : (
                        <div className="no-contacts">No friends</div>
                    )}
                </div>
            </div>  
    </>);

}

export default Contacts;