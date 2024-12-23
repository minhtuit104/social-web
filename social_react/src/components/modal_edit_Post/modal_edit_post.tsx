import { useEffect, useState } from "react";
import postEventEmitter from "../../patternEventEmitter/postEventEmitter";
import { updatePost } from "../../services/PostService";
import closeIcon from "../../assets/images/icons/ic_close.svg";
import { Button, Modal } from "react-bootstrap";
import "./modal_edit_post.css";
import { toast } from "react-toastify";

interface Post {
    idPost: number;
    authorId?: {
        idUser: number;
        name?: string;
        avarta?: string;
    };
    title?: string;
    image?: string;
    privacy: string;
    totalEmotion: number;
    totalComment: number;
    createAt: Date;
}

interface ModalEditPostProps {
    show: boolean;
    post: Post;
    handleClose: () => void;
}

const ModalEditPost = ({show, post, handleClose}: ModalEditPostProps) => {
    
    const [title, setTitle] = useState(post.title || "");
    const [privacy, setPrivacy] = useState(post.privacy);
    const [images, setImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if(post){
            setTitle(post.title || "");
            setPrivacy(post.privacy || "Publish");

            if(post.image){
                setImages(post.image.split(',').map((img: string) => img.trim()));
            }else{
                setImages([]);
            }
        }
    }, [post]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const update = await updatePost(post.idPost, {
                title,
                privacy,
                image: images.join(',')
            });

            //Emit event để cập nhật lại post
            postEventEmitter.emit("updatePost", update);
            toast.success('Update post success');
            handleClose();
        } catch (error) {
            console.error('Lỗi khi cập nhật post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg" dialogClassName="modal-edit-post">
            <Modal.Header closeButton>
                <Modal.Title style={{ display: 'flex', justifyContent: 'center', width: '100%'}}>Edit Post</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="modal-edit-post-body">
                    <div className="modal-edit-post-header">
                        <img src={post.authorId?.avarta ?? 'https://www.gravatar.com/avatar/?d=mp'} alt={post.authorId?.name} className="avatar"/>
                        <div className="author-info">
                            <span>{post.authorId?.name}</span>
                            <select 
                                value={privacy} 
                                onChange={(e) => setPrivacy(e.target.value)} 
                                className="form-select"
                            >
                                <option value="Publish">Publish</option>
                                <option value="Friends">Friends</option>
                            </select>
                        </div>
                    </div>
                    <div className="modal-edit-post-content">
                        <textarea 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            placeholder="What's on your mind?"
                            className="form-control"
                        />
                        {/* Phần hiển thị ảnh */}
                        {images.length > 0 && (
                            <div className="modal-edit-post-images">
                                {images.map((image, index) => (
                                    <div key={index} className="image-wrapper">
                                    <img 
                                        src={image} 
                                        alt={`Post image ${index + 1}`} 
                                        className="post-image"
                                    />
                                    <button 
                                        type="button" 
                                        className="remove-image-btn"
                                        onClick={() => {
                                            setImages(prev => prev.filter((_, i) => i !== index));
                                        }}
                                    >
                                        <img src={closeIcon} alt="close" className="ic-18"/>
                                    </button>
                                </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer style={{flexDirection: 'row-reverse'}}>
                <Button 
                    variant="primary" 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Updating..." : "Update"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalEditPost;