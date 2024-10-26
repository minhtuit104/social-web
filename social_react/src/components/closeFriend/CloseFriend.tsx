import "./closeFriend.css";
import ImgUser1 from "../../assets/images/luan1.jpg";
const CloseFriend = () => {
    return (
        <div className="profileMenu-FriendsItem">
            <img src={ImgUser1} alt="" className="profileMenu-FriendsItem-Avatar" />
            <span className="profileMenu-FriendsItem-Name">Nguyễn Thành Luân</span>
        </div>
    );
}

export default CloseFriend;