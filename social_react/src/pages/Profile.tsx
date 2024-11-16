import "../assets/css/profile.css";
import ProfileHeader from "../components/profileHeader/ProfileHeader";
import ProfilePostList from "../components/profilePostList/ProfilePostList";
import { UserProvider } from "../components/UserContext/UserContext";
import NavBar from "../layouts/NavBar";
import { useParams } from "react-router-dom";

const Profile = () => {
    const {userId} = useParams<{userId: string}>();
    const userIdNumber = Number(userId);

    return (<>
        <UserProvider>
        <div className="profileContainer">
            {/* <ProfileMenu /> */}
            <NavBar />
            
            <div className="profileContent" id="scrollableDiv-myPosts">
                <div className="profile-wrapper">
                    <ProfileHeader
                        key={`header-${userIdNumber}`}
                        idUser={userIdNumber} 
                    />
                    <ProfilePostList 
                        key={`post-${userIdNumber}`}
                        idUser={userIdNumber} 
                    />
                </div>
            </div>
        </div>
        </UserProvider>
    </>);
}

export default Profile; 