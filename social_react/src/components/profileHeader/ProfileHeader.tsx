import "./profileHeader.css";
import ImgCover from "../../assets/images/anh4.jpg";
import ImgUser1 from "../../assets/images/avatar.jpg";
import ImgLocation from "../../assets/images/icons/ic_location.svg";
import ImgFollow from "../../assets/images/icons/ic_friendss.svg";
import { useEffect, useState } from "react";
import { fectchUserName } from "../../services/UserService";

interface ProfileHeaderProps {
    idUser: number | undefined;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({idUser}) => {
    const [avarta, setAvarta] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const getUser = async () => {
            if(idUser){
                try {   
                    const userData = await fectchUserName(idUser);
                    if(userData){
                        setAvarta(userData.avarta);
                        setName(userData.name);
                        // console.log('userData===', userData);
                    }
                } catch (error) {
                    console.error('Failed to fetch user name:', error);
                } finally {
                    setIsLoading(false);
                }
            }

        };
        getUser();
    },[idUser])

    if(isLoading){
        return <div>Loading...</div>;
    }
    return (<>
        <div className="profileHeader">
            <div className="profileHeader-Cover">
                <img src={ImgCover} alt="" className="profileHeader-CoverImg" />
                <img src={avarta ?? 'https://www.gravatar.com/avatar/?d=mp' } alt="Profile Image" className="profileHeader-AvatarImg" />
            </div>
            <div className="profileHeader-Info">
                <h4 className="profileHeader-Name">{name}</h4>
                <span className="profileHeader-Desc">Hello everyone</span>
                <span className="profileHeader-Location"><img src={ImgLocation} alt="Location" className="ic-18" />Hà Nội, Việt Nam</span>
                <div className="profileHeader-Follow"><img src={ImgFollow} alt="Follow" className="ic-18" />3,2tr follower</div>
            </div>
        </div>
    </>);
}

export default ProfileHeader;
