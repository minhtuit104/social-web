import { useState } from "react";
import "../assets/css/profile.css";
import ProfileHeader from "../components/profileHeader/ProfileHeader";
import ProfilePostList from "../components/profilePostList/ProfilePostList";
import { UserProvider } from "../components/UserContext/UserContext";
import NavBar from "../layouts/NavBar";
import { useParams } from "react-router-dom";
import SavePostList from "../components/savePostList/SavePostList";

const Profile = () => {
    const {userId} = useParams<{userId: string}>();
    const userIdNumber = Number(userId);
    const [showSavePost, setShowSavePost] = useState(false);

    const handleToggleSavePosts = () => {
        setShowSavePost(!showSavePost);
    };

    return (<>
        <UserProvider>
        <div className="profileContainer">
            <NavBar />
            <div className="profileContent" id="scrollableDiv-myPosts">
                <div className="profile-wrapper">
                    <ProfileHeader
                        key={`header-${userIdNumber}`}
                        idUser={userIdNumber}
                        onSavedPostsClick={handleToggleSavePosts}
                        showingSavedPosts={showSavePost} 
                    />
                    {showSavePost ? (
                        <SavePostList/>
                    ) : (
                        <ProfilePostList 
                            key={`post-${userIdNumber}`}
                            idUser={userIdNumber} 
                        />
                    )}
                </div>
            </div>
        </div>
        </UserProvider>
    </>);
}

export default Profile; 