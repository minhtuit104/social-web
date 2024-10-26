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

const NavBar = () => {

    const location = useLocation();
    const [activeTab, setActiveTab] = useState('');
    const [userName, setUserName] = useState<string | null>(null);
    const [emailInfo, setEmailInfo] = useState<string | null>(null);
    const [avarta, setAvarta] = useState<string | null>(null);
    const [showModalNotification, setShowModalNotification] = useState(false);//hiển thị modal thông báo

    //hàm hiển thị đóng mở modal thông báo
    const toggleModalNotification = () => {
        setShowModalNotification(!showModalNotification);
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
    }, [location]);

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/home");
        toast.success("Logout success!")
    }
    const handleProfile = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        navigate(`/profile/${idUser}`);
    }
    const handleMessage = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        navigate("/home/messager");
    }

    return (<>
    <div className="nav-side-bar">
        <div className="profile">
            <div className="profile-image">
                <a href="/home/profile" onClick={handleProfile}><img src={avarta ?? 'https://www.gravatar.com/avatar/?d=mp' } alt="Profile Image" /></a>
            </div>
            <h3>{userName ?? 'Loading...'}</h3>
            <p>{emailInfo ?? 'Loading...'}</p>
        </div>
        <nav>
            <ul>
                <li className={activeTab === "new-feed" ? "active" : ""}><a href="/home"><img src={IconNew} alt="" className="ic-22" />News Feed</a></li>
                <li><a href="/home/messager" onClick={handleMessage}><img src= {IconMessage} alt="" className="ic-22" />Messages</a><span className="quantity">9</span></li>
                <li><a href="/friends"><img src= {IconFriend} alt="" className="ic-22" />Friends</a><span className="quantity">9</span></li>
                <li><a href="#" onClick={toggleModalNotification}><img src= {IconNotting} alt="" className="ic-22" />Notifications</a><span className="quantity">9</span></li>
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
        handleClose={toggleModalNotification} />
    )}
    </>);
}

export default NavBar;