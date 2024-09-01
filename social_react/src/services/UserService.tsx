import axios from "./axios";



// const fetchAllUser = () =>{
//     return axios.get("/api/v1/users");
// }

const loginApi = (email: string, password: string) => {
    return axios.post('/api/v1/auth/login', {email, password});
}

export {loginApi};