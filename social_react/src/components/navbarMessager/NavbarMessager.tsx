import "./navbarmessager.css";
import Logo from "../../assets/images/logo.jpg";
import IconSearch from "../../assets/images/icons/ic_search.svg";
import IconHome from "../../assets/images/icons/ic_home.svg";
import IconFriend from "../../assets/images/icons/ic_friends.svg";
import IconNotification from "../../assets/images/icons/ic_notifications.svg";
import IconSetting from "../../assets/images/icons/ic_setting.svg";
import { useEffect, useState } from "react";
import { fectchUserName } from "../../services/UserService";
import { useNavigate } from "react-router-dom";

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

const NavbarMessager = () => {
    const user = getUserFromToken();
    const currentUserId = user?.idUser;
    const [avarta, setAvarta] = useState<string | null>(null);
    const navigate = useNavigate();


    useEffect(() => {
        const getUser = async () => {
            if (currentUserId) {
                const userData = await fectchUserName(currentUserId);
                setAvarta(userData?.avarta);
            }
        };
        getUser();
    }, [currentUserId]);

    const hadleHome = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        navigate("/home");
    }


  return (
    <div className="navbarMessager">
        <div className="navbarMessagerWrapper">
            <div className="navbarMessagerLeft">
                <div className="logo">
                <a href="/home" onClick={hadleHome}><img src={Logo} alt="" className="logoImg" /></a>
                </div>
                <div className="navbarMessagerInput">
                    <input type="text" placeholder="Search post or video" />
                    <img src={IconSearch} alt="" className="ic-24" />
                </div>
            </div>
            <div className="navbarMessagerRight">
                <div className="navbarMessagerRightIcon">
                    <div className="Options">
                        <a href="/home" onClick={hadleHome}><img src={IconHome} alt="" className="ic-22 icons" /></a>
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
                    <img src={avarta ?? 'https://www.gravatar.com/avatar/?d=mp' } alt="Profile Image" className="avatarUser" />
                </div>
            </div>
        </div>
  </div>
  )
};

export default NavbarMessager;
