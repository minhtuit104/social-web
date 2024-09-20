import IconUser from "./assets/images/icons/ic_user.svg";
import IconEye from "./assets/images/icons/ic_eye.svg";
import IconLockEye from "./assets/images/icons/ic_lock_eye.svg";
import { useState } from "react";
import {loginApi, registerApi} from './services/UserService';
import { toast } from "react-toastify";
import {useNavigate} from "react-router-dom";

const Login = () => {

    const navigate = useNavigate();

    const [action, setAction] = useState('');
    const registerLink = () => {
        setAction(' show_register');
    };
    const loginLink = () => {
        setAction('');
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isShowPassword, setIsShowPassword] = useState(false);

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        if(!email || !password){
            toast.error("'Email/Password is required!!'");
            return;
        }
        try {
            let res = await loginApi(email, password);
            console.log("check res: ", res); 
            if(res && res.data.access_token){
                localStorage.setItem("token", res.data.access_token);
                toast.success("Login successful!");
                navigate("/home",{ replace: true});
            }else {
                if(res && res.status === 400){
                    toast.error(res.data.message.message);
                };
            }    
        } catch (err) {
            console.error("Login error:", err);
        }
    }


    const [formData, setFormData] = useState({
        name: '',
        email: '',
        birthday: '',
        password: ''
      });
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
      };
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
            let res = await registerApi(formData.name, formData.email, formData.birthday, formData.password);
            console.log('Registration successful:', res);
            toast.success("Register successful!");
            navigate("/login");
            // Handle successful registration (e.g., redirect to login)
        } catch (error) {
            console.error('Registration failed:', error);
            toast.error("Register failed!!!");
            // Handle registration error
        }
    };


    return (
        <div className="main-container">
            <div className={`wrapper${action}`}>
                    <div className="form-box login">
                        <form action="#" onSubmit={handleLogin}> 
                            <h2>Welcome</h2>
                            <div className="input-field">
                                <input type="text" id="username" placeholder="Enter email or phone number"  required
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                                <img src={IconUser} alt="user" className="ic-18 icon" />
                            </div>

                            <div className="input-field">
                                <input
                                    type={isShowPassword === true ? "text": "password"} 
                                    id="input-pass" placeholder="Enter password"  required
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                                <img src={isShowPassword ? IconEye: IconLockEye} alt="user" className="ic-18 icon" 
                                    onClick={() => setIsShowPassword(!isShowPassword)}
                                />
                            </div>

                            <a href="/ForgotPage" className="forgot">
                                <p>Forgot password?</p>
                            </a>

                            <button type="submit" className={email && password ? "showlogin" : ""}
                            // onClick={() => handleLogin()}
                            >Login</button>

                            <div className="registerLink">
                                <p>Don't have an account? <a href="#register" className="register" onClick={registerLink}>Register</a></p>
                            </div>
                        </form>
                    </div>
                    
                    {/*start form đăng kí */}
                    <div className="form-box register">
                        <form action="#" onSubmit={handleRegister}> 
                            <h2>Registration</h2>
                            
                            <div className="input-field">
                                <input 
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleChange}
                                required/>
                            </div>

                            <div className="input-field">
                                <input 
                                type="text"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required/>
                            </div>

                            <div className="input-field">
                                <input 
                                type="date" 
                                name="birthday" 
                                placeholder="Birthday"
                                value={formData.birthday}  
                                onChange={handleChange}
                                required/>
                            </div>

                            <div className="input-field">
                                <input type="password" 
                                name="password" 
                                placeholder="Password " 
                                value={formData.password}
                                onChange={handleChange}
                                required/>
                            </div>

                            <button type="submit" className="login">Register</button>

                            <div className="registerLink">
                                <p>Already have an account? <a href="/" className="register" onClick={loginLink}>Login</a></p>
                            </div>
                        </form>
                    </div>
            </div>
        </div>
    );
}

export default Login;