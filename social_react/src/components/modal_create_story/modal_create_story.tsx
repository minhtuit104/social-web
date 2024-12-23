import React, { useState } from "react";
import IconClose from "../../assets/images/icons/ic_close.svg";
import IconPlus from "../../assets/images/icons/ic_plus.svg";
import "./modal_create_story.css";
import { Modal } from "react-bootstrap";
import { createStory } from "../../services/StoryService";
import { getDownloadURL, ref, uploadBytes} from "firebase/storage";
import { storage } from "../../firebaseConfig";
import { toast } from "react-toastify";
import storyEventEmitter from "../../patternEventEmitter/storyEventEmitter";

interface ModalCreateStoryProps {
    show: boolean;
    handleClose: () => void;
    onStoryCreated: (newStory: any) => void;
}

const ModalCreateStory: React.FC<ModalCreateStoryProps> = ({show, handleClose, onStoryCreated}) => {

    const [image, setImage] = useState<File | null>(null);
    const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    //hàm chọn ảnh
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files?.[0];
        if (files) {
            setImage(files);
            setFileType(files.type.startsWith('image/') ? 'image' : 'video');
        }
    }

    //hàm xóa ảnh
    const handleImageRemove = () => {
        setImage(null);
        setFileType(null);
    }

    //hàm tạo story
    const handleCreateStory = async () => {
        if(image && fileType && !isSubmitting) {
            setIsSubmitting(true);
            try {
                //upload image lên firebase
                const imageRef = ref(storage, `ImgStory/${Date.now()}_${image.name}`);
                await uploadBytes(imageRef, image);
                const downloadURL = await getDownloadURL(imageRef);

                //tạo story
                const storyData = {
                    image: downloadURL,
                    fileType: fileType
                }
                const res = await createStory(storyData);
                onStoryCreated(res.data);
                console.log('API response: ', res);
                
                if(res.data) {
                    toast.success('Story created successfully');
                    storyEventEmitter.emit('storyCreated', res.data);
                    onStoryCreated(res.data);
                    handleClose();
                    //reset state
                    setImage(null);
                    setFileType(null);
                }
            } catch (error: any) {
                console.error('Error creating story:', error);
                toast.error(error.response?.data?.message || 'Error creating story');
            } finally {
                setIsSubmitting(false);
            }
        }
    }

    return (<>
        <Modal show={show} onHide={handleClose} className="modal-create-story">
            <Modal.Header closeButton>
                <Modal.Title style={{ display: 'flex', justifyContent: 'center', width: '100%', fontSize: '20px', fontWeight: '600'}}>Create Story</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="story-upload-container">
                    <div className="modal-avatar-actions">
                        <button onClick={() => document.getElementById('imageInput')?.click()}><img src={IconPlus} className="ic-22"/>Upload image or video</button>
                        <input
                            id="imageInput"
                            type="file"
                            accept="image/*, video/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                    {/* Hiển thị hình ảnh đã chọn */}
                    {image && (
                        <div className="story-preview">
                            {fileType === 'image' ? (
                                <img 
                                    src={URL.createObjectURL(image)} 
                                    alt="Story preview" 
                                />
                            ) : (
                                <video 
                                    src={URL.createObjectURL(image)} 
                                    controls
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            )}
                            <button onClick={handleImageRemove}>
                                <img src={IconClose} alt="close" className="ic-18"/>
                            </button>
                        </div>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button
                    onClick={handleCreateStory}
                    disabled={!image || isSubmitting}
                    className="create-story-btn"
                >
                    {isSubmitting ? "Creating..." : "Create Story"}
                </button>
            </Modal.Footer>
        </Modal>
    </>);
}

export default ModalCreateStory;