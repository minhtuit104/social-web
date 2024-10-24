import { Button, Modal } from "react-bootstrap";
import IconLibrary from "../assets/images/icons/ic_library.svg";
import IconGlobal from "../assets/images/icons/ic_global.svg";
import IconFriends from "../assets/images/icons/ic_friends.svg";
import IconClose from "../assets/images/icons/ic_close.svg";
import IconArrdow from "../assets/images/icons/ic_arrorw-dow.svg";
import "../assets/css/content_post_input.css";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebaseConfig";
import { createPost } from "../services/PostService";
import { toast } from "react-toastify";
import { fectchUserName } from "../services/UserService";
import postEventEmitter from "../patternEventEmitter/postEventEmitter";


const ModalInputPost: React.FC<any> = (props) => {
    const {show, handleClose} = props;
    const [userName, setUserName] = useState<string | null>(null);
    const [avarta, setAvarta] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [image, setImage] = useState<File[]>([]);
    const [privacy, setPrivacy] = useState("Publish");
    const [privacyIcon, setPrivacyIcon] = useState(IconGlobal);
    const [showPrivacyOptions, setShowPrivacyOptions] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Hàm giải mã token
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
    const user = getUserFromToken();
    const idUser = user?.idUser;
    useEffect(() => {
      const getUser = async () =>{
        if(idUser){
          try {
            const userData = await fectchUserName(idUser);
            if(userData && userData.name){
              setUserName(userData.name);
              setAvarta(userData.avarta);
            }
          } catch (error) {
            console.error('Failed to fetch user name:', error);
          }
        }
      };
      getUser();
    },[idUser])

    //hàm hay đổi quyền riêng tư
    const handlePrivacyChange = (option: string, icon: string) => {
      setPrivacy(option);
      setPrivacyIcon(icon);
      setShowPrivacyOptions(false);
    };
    
    //hàm xử lý khi chọn ảnh
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files;
      if (file) {
        setImage(Array.from(file));
      }
    };

    //hàm xóa ảnh
    const removeImage = (index: number) => {
      setImage(prevImages => prevImages.filter((_, i) => i !== index));
    }

    //hàm xử lý khi lưu bài viết
    const handleSavePost = async () => {
      if (!isSubmitting){ // Ngăn gọi hàm nhiều lần

      setIsSubmitting(true); // Đánh dấu là đang submit
      
      try {
        //upload các ảnh lên firebase và lấy URL
        const imageUrls = await Promise.all(
          image.map( async (imgFile) => {
            const imageRef = ref(storage, `images/${Date.now()}_${imgFile.name}`);
            await uploadBytes(imageRef, imgFile);
            const downloadURL = await getDownloadURL(imageRef);
            return downloadURL;
          })
        );
  
        const postData = {
          title,
          image: imageUrls.join(','),
          privacy,
        };
  
        const res = await createPost(postData);
        console.log("...check res:::", res);

        if( res && res.data ){
          toast.success("Post created successfully")
          postEventEmitter.emit('postCreated', res.data);
          handleClose();
          //thêm post vừa upload vào đầu danh sách
          
        }
      } catch (error) {
        console.error('Error creating post:', error);
      } finally{
        setIsSubmitting(false); // mở lại nut submit sau khi xong
      }
    }
  };


    return (<>
        <Modal show={show} onHide={handleClose} dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title style={{ display: 'flex', justifyContent: 'center', width: '100%'}}>Create post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div>
                <div className="modal-post-header">
                    <img src={avarta ?? 'https://www.gravatar.com/avatar/?d=mp' } alt="Profile Image" className="post-profile-image"/>
                    <div className="post-info">
                        <span>{userName}</span>
                        <div className="privacy-down">
                          <button 
                          className="privacy-btn"
                          onClick={() => setShowPrivacyOptions(!showPrivacyOptions)}
                          >
                            <img src={privacyIcon} className="ic-18"/>{privacy}<img src={IconArrdow} className="list"/>
                          </button>
                          {/* Menu lựa chọn quyền riêng tư */}
                          {showPrivacyOptions && (
                            <div className="privacy-options">
                              <div 
                              className="privacy-option"
                              onClick={() => handlePrivacyChange("Publish", IconGlobal)}
                              >
                                <img src={IconGlobal} className="ic-18" />
                                Publish
                              </div>
                              <div 
                              className="privacy-option"
                              onClick={() => handlePrivacyChange("Friends", IconFriends)}
                              >
                                <img src={IconFriends} className="ic-18" />
                                Friends
                              </div>
                            </div>
                          )}
                        </div>
                    </div>
                </div>
                <div className="modal-post-content">
                    <textarea placeholder="What are you thinking?...."
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    />
                </div>
                {/* Nút chọn ảnh, video */}
                <div className="modal-post-actions">
                    <button onClick={() => document.getElementById('imageInput')?.click()}><img src={IconLibrary} className="ic-18"/>Image/Video</button>
                    <input 
                    type="file" 
                    placeholder="hihi"
                    id="imageInput"
                    accept="image/*, video/*"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                    multiple
                    /> 
                </div>
                {/* Hiển thị hình ảnh đã chọn */}
                {image.length > 0 && (
                  <div className="image-preview">
                    {image.map((file, index) => (
                      <div key={`img-${index}`} className="show-image">
                        <img  src={URL.createObjectURL(file)} alt={`select-${index}`}/>
                        <button onClick={() => removeImage(index)}>
                          <img src={IconClose} alt="close"/>
                        </button>
                      </div>    
                    ))}

                  </div>
                )}

            </div>
        </Modal.Body>
        <Modal.Footer style={{flexDirection: 'row-reverse'}}>
          <Button 
          variant="primary" 
          onClick={handleSavePost} 
          disabled={ isSubmitting || !(title || image.length > 0)}
          className={title || image.length > 0 ? "showSavePost": ""}
          >
          {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>);
}

export default ModalInputPost;