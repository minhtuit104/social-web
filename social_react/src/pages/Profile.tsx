import "../assets/css/profile.css";
import NavbarMessager from "../components/navbarMessager/NavbarMessager";
import ProfileHeader from "../components/profileHeader/ProfileHeader";
import ProfileMenu from "../components/profileMenu/ProfileMenu";
import ProfilePostList from "../components/profilePostList/ProfilePostList";
import NavBar from "../layouts/NavBar";
import { useParams } from "react-router-dom";

const Profile = () => {
    const {userId} = useParams<{userId: string}>();
    const userIdNumber = Number(userId);

    return (<>
        <NavbarMessager />
        <div className="profileContainer">
            {/* <ProfileMenu /> */}
            <NavBar />
            <div className="profileContent">
                <ProfileHeader idUser={userIdNumber} />
                <ProfilePostList idUser={userIdNumber} />
            </div>
        </div>
    </>);
}

export default Profile; 