import Avartar from "../assets/images/tu.jpg";
import IconNew from "../assets/images/icons/ic_news.svg";
import IconMessage from "../assets/images/icons/ic_message.svg";
import IconFriend from "../assets/images/icons/ic_friends.svg";
import IconNotting from "../assets/images/icons/ic_notifications.svg";
import IconSetting from "../assets/images/icons/ic_setting.svg";
import "../assets/css/nav_bar.css";
import { NavDropdown } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const NavBar = () => {

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
        toast.success("Logout success!")
    }

    return (<>
    <div className="nav-side-bar">
        <div className="profile">
            <div className="profile-image">
                <img src={Avartar} alt="Profile Image" />
            </div>
            <h3>Tạ Minh Tú</h3>
            <p>@taminhtu1004</p>
        </div>
        <nav>
            <ul>
                <li><a href="/home"><img src={IconNew} className="ic-22" />News Feed</a></li>
                <li><a href="/message"><img src= {IconMessage} className="ic-22" />Messages</a><span className="quantity">9</span></li>
                <li><a href="/friends"><img src= {IconFriend} className="ic-22" />Friends</a><span className="quantity">9</span></li>
                <li><a href="/notifications"><img src= {IconNotting} className="ic-22" />Notifications</a><span className="quantity">9</span></li>
                <li>
                    <img src= {IconSetting} className="ic-22 icSetting" alt="Settings" />
                    <NavDropdown title="Settings" className="DropdownSetting" style={{marginLeft: '-13px'}}>
                        <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => handleLogout()}>Logout</NavDropdown.Item>
                    </NavDropdown>
                </li>
            </ul>
        </nav>  
                     
    </div>

    </>);
}

export default NavBar;