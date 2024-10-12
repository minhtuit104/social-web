import "./navbarmessager.css";
import Logo from "../../assets/images/logo.jpg";
import IconSearch from "../../assets/images/icons/ic_search.svg";
import IconHome from "../../assets/images/icons/ic_home.svg";
import AvatarUser from "../../assets/images/tu.jpg";
import IconFriend from "../../assets/images/icons/ic_friends.svg";
import IconNotification from "../../assets/images/icons/ic_notifications.svg";
import IconSetting from "../../assets/images/icons/ic_setting.svg";


const NavbarMessager = () => {
  return (
    <div className="navbarMessager">
        <div className="navbarMessagerWrapper">
            <div className="navbarMessagerLeft">
                <div className="logo">
                <a href="/home"><img src={Logo} alt="" className="logoImg" /></a>
                </div>
                <div className="navbarMessagerInput">
                    <input type="text" placeholder="Search post or video" />
                    <img src={IconSearch} alt="" className="ic-24" />
                </div>
            </div>
            <div className="navbarMessagerRight">
                <div className="navbarMessagerRightIcon">
                    <div className="Options">
                        <a href="/home"><img src={IconHome} alt="" className="ic-22 icons" /></a>
                    </div>
                    <div className="Options">
                        <a href="/friends"><img src={IconFriend} alt="" className="ic-22 icons" /></a>
                    </div>
                    <div className="Options">
                        <a href="/notifications"><img src={IconNotification} alt="" className="ic-22 icons" /></a>
                    </div>
                    <div className="Options">
                        <img src={IconSetting} alt="" className="ic-22 icons" />
                    </div>                   
                </div>
                <div className="navbarMessagerRightItem">
                    <img src={AvatarUser} alt="" className="avatarUser" />
                </div>
            </div>
        </div>
  </div>
  )
};

export default NavbarMessager;
