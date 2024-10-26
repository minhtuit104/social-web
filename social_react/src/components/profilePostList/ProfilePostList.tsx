import MyPosts from "../myPosts/MyPosts";
import "./profilePostList.css";

interface ProfilePostListProps {
    idUser: number;
}

const ProfilePostList: React.FC<ProfilePostListProps> = ({idUser}) => {
    return (<>
        <div className="profilePostList">
            <MyPosts idUser={idUser} />
        </div>
    </>);
}

export default ProfilePostList;

