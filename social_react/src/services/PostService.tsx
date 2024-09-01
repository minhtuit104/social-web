import axios from "./axios";

const fetchPosts = async () =>{
    return await axios.get('/api/v1/posts');
}

export {fetchPosts};