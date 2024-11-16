import { Modal } from "react-bootstrap";
import "./modal_updateAvatar.css";
import IconPlus from "../../assets/images/icons/ic_plus.svg";
import IconClose from "../../assets/images/icons/ic_close.svg";
import { useEffect, useState } from "react";
import { fectchUserName, updateAvatar } from "../../services/UserService";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebaseConfig";
import { toast } from "react-toastify";
import { useUser } from "../UserContext/UserContext";

interface ModalUpdateAvatarProps {
    show: boolean;
    handleClose: () => void;
    onAvatarUpdate?: (newAvatar: string) => void;
}

const ModalUpdateAvatar: React.FC<ModalUpdateAvatarProps> = (props) => {
    const {show, handleClose, onAvatarUpdate} = props;
    const [userName, setUserName] = useState<string | null>(null);
    const [avarta, setAvarta] = useState<string | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { updateUserAvatar } = useUser();
      

    //hàm xử lý khi chọn ảnh
    const handleImageChanger = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if(file){
            setImage(file);
        }
    }
    //hàm xóa ảnh
    const removeImage = () => {
        setImage(null);
    }

    const handleUpdateAvatar = async () => {
        if(!isSubmitting && image){
            setIsSubmitting(true);

            try {
                //upload ảnh lên firebase lấy downloadURL
                const imageRef = ref(storage, `images/${Date.now()}_${image.name}`);
                await uploadBytes(imageRef, image);
                const downloadURL = await getDownloadURL(imageRef);

                //cập nhật avatar mới
                const res = await updateAvatar(downloadURL);

                //kiểm tra response từ API
                if(res){
                    //cập nhật lại avatar mới
                    setAvarta(res);
                    onAvatarUpdate?.(res); //gọi hàm callback để cập nhật avatar mới
                    updateUserAvatar(res); //cập nhật avatar mới vào context
                    toast.success(res.message || 'Update avatar success');
                    handleClose();
                    setImage(null);
                }else{
                    console.log('res bị lỗi là:', res);
                    toast.error(res.message || 'Update failed');
                }
            } catch (error) {
                console.error('Failed to upload image:', error);
                toast.error('Update avatar failed');
            } finally {
                setIsSubmitting(false);
            }
        }else if(!image){
            toast.warning('Please select an image');
        }
    }

    //hàm xóa ảnh khi unmount component
    useEffect(() => {
        return () => {
            if (image) {
                URL.revokeObjectURL(URL.createObjectURL(image));
            }
        };
    }, [image]);

    return (<>
        <Modal show={show} onHide={handleClose} dialogClassName="modal-update-avatar">
        <Modal.Header closeButton>
          <Modal.Title style={{ display: 'flex', justifyContent: 'center', width: '100%'}}>Update Avatar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="modal-avatar-body">
                <div className="modal-avatar-actions-newAvatar">
                    {/* Nút chọn ảnh, video */}
                    <div className="modal-avatar-actions">
                        <button onClick={() => document.getElementById('imageInput')?.click()}><img src={IconPlus} className="ic-18"/>Upload image</button>
                        <input 
                        type="file" 
                        placeholder="hihi"
                        id="imageInput"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageChanger}
                        /> 
                    </div>
                    {/* Hiển thị hình ảnh đã chọn */}
                    {image && (
                    <div className="image-preview">
                        <div className="show-image">
                            <img  src={URL.createObjectURL(image)} alt="image-selected"/>
                            <button onClick={removeImage}>
                                <img src={IconClose} alt="close" className="ic-18"/>
                            </button>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer style={{flexDirection: 'row-reverse'}}>
            <button 
            onClick={handleUpdateAvatar}
            disabled={isSubmitting}
            className={isSubmitting ? 'updating' : ''}
            >
                {isSubmitting ? 'Updating...' : 'Update'}
            </button>
        </Modal.Footer>
        </Modal>
    </>)
}

export default ModalUpdateAvatar;

