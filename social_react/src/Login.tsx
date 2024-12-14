import IconUser from "./assets/images/icons/ic_user.svg";
import IconEye from "./assets/images/icons/ic_eye.svg";
import IconLockEye from "./assets/images/icons/ic_lock_eye.svg";
import IconError from "./assets/images/icons/ic_error.svg";
import { useEffect, useState } from "react";
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
        navigate("/login");
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        name: '',
        birthday: '',
    });

    useEffect(() => {
        // Reset errors khi chuyển đổi giữa login và register
        setErrors({
            email: '',
            password: '',
            name: '',
            birthday: ''
        });
    }, [action]);

    // Hàm xử lý validate email
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setEmail(value);

        // Validate email realtime
        const newErrors = {...errors};
        if(!value.trim()){
            newErrors.email = "Email is required";
        } else if (!/^[a-zA-Z0-9._-]+@gmail\.com$/.test(value)){
            newErrors.email = "Invalid email format";
        } else {
            newErrors.email = '';
        }
        setErrors(newErrors);
    };

    // Hàm xử lý validate password
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setPassword(value);
        
        // Validate password realtime
        const newErrors = { ...errors };
        if (!value) {
            newErrors.password = "Password is required";
        } else if (value.length < 6) {
            newErrors.password = "Password must be at least 6 characters long";
        } else {
            newErrors.password = ""; // Xóa lỗi nếu hợp lệ
        }
        setErrors(newErrors);
    };

    // Hàm xử lý login
    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Kiểm tra dữ liệu đăng nhập
    
        setIsLoading(true); 
        try {
            let res = await loginApi(email, password);
            if(res && res.data.access_token){
                localStorage.setItem("token", res.data.access_token);
                setTimeout(() => {
                    setIsLoading(false);
                    window.location.href = "/home";
                }, 500);
                toast.success("Login successful!");
            }else {
                if(res && res.status === 400){
                    toast.error(res.data.message.message);
                };
                setIsLoading(false);
            }    
        } catch (err) {
            console.error("Login error:", err);
            setIsLoading(false);
        }
    }


    const [formData, setFormData] = useState({
        name: '',
        email: '',
        birthday: '',
        password: ''
    });
    
    // Hàm xử lý validate đăng kí
    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });

        const newErrors = {...errors};
        switch(name){
            case 'name':
                if(!value.trim()){
                    newErrors.name = "Name is required";
                } else if (value.length < 2){
                    newErrors.name = "Name must be at least 2 characters long";
                } else {
                    newErrors.name = '';
                }
                break;
            case 'email':
                if(!value.trim()){
                    newErrors.email = "Email is required";
                } else if (!/^[a-zA-Z0-9._-]+@gmail\.com$/.test(value)){
                    newErrors.email = "Invalid email format";
                } else {
                    newErrors.email = '';
                }
                break;
            case 'birthday':
                if(!value.trim()){
                    newErrors.birthday = "Birthday is required";
                } else {
                    newErrors.birthday = '';
                }
                break;
            case 'password':
                if(!value.trim()){
                    newErrors.password = "Password is required";
                } else if (value.length < 6){
                    newErrors.password = "Password must be at least 6 characters long";
                } else {
                    newErrors.password = '';
                }
                break;
        }
        setErrors(newErrors);
    };

    // Hàm xử lý đăng kí tài khoản
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            let res = await registerApi(formData.name, formData.email, formData.birthday, formData.password);
            console.log('Registration successful:', res);
            if(res && res.status === 400){
                toast.error(res.data.message.message);            
            }else{
                toast.success("Register successful!");
                navigate("/login");
            }
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
                {/* Form đăng nhập */}
                    <div className="form-box login">
                        <form action="#" onSubmit={handleLogin}> 
                            <h2>Welcome</h2>
                            <div className="input-field">
                                <input type="text" id="username" placeholder="Enter email or phone number"
                                    value={email}
                                    onChange={handleEmailChange}
                                />
                                <img src={IconUser} alt="user" className="ic-18 icon" />
                                {errors.email && (
                                    <div className="error-message">
                                        <img src={IconError} alt="error" className="ic-error" />
                                        {errors.email}
                                    </div>
                                )}
                            </div>

                            <div className="input-field">
                                <input
                                    type={isShowPassword === true ? "text": "password"} 
                                    id="input-pass" placeholder="Enter password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                                <img src={isShowPassword ? IconEye: IconLockEye} alt="user" className="ic-18 icon" 
                                    onClick={() => setIsShowPassword(!isShowPassword)}
                                />
                                {errors.password && (
                                    <div className="error-message">
                                        <img src={IconError} alt="error" className="ic-error" />
                                        {errors.password}
                                    </div>
                                )}
                            </div>

                            <a href="/ForgotPage" className="forgot">
                                <p>Forgot password?</p>
                            </a>

                            <button 
                                type="submit" 
                                className={email && password ? "showlogin" : ""}
                                disabled={isLoading || !email || !password}
                            >
                                {isLoading ? 'Loading...' : 'Login'}
                            </button>

                            <div className="registerLink">
                                <p>Don't have an account? <a href="#register" className="register" onClick={registerLink}>Register</a></p>
                            </div>
                        </form>
                    </div>
                    
                {/* Form đăng kí */}
                    <div className="form-box register">
                        <form action="##" onSubmit={handleRegister}> 
                            <h2>Registration</h2>
                            
                            <div className="input-field">
                                <input 
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleRegisterChange}
                                />
                                {errors.name && (
                                    <div className="error-message">
                                        <img src={IconError} alt="error" className="ic-error" />
                                        {errors.name}
                                    </div>
                                )}
                            </div>

                            <div className="input-field">
                                <input 
                                type="text"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleRegisterChange}
                                />
                                {errors.email && (
                                    <div className="error-message">
                                        <img src={IconError} alt="error" className="ic-error" />
                                        {errors.email}
                                    </div>
                                )}
                            </div>

                            <div className="input-field">
                                <input 
                                type="date" 
                                name="birthday" 
                                placeholder="Birthday"
                                value={formData.birthday}  
                                onChange={handleRegisterChange}
                                />
                                {errors.birthday && (
                                    <div className="error-message">
                                        <img src={IconError} alt="error" className="ic-error" />
                                        {errors.birthday}
                                    </div>
                                )}
                            </div>

                            <div className="input-field">
                                <input type="password" 
                                name="password" 
                                placeholder="Password " 
                                value={formData.password}
                                onChange={handleRegisterChange}
                                />
                                {errors.password && (
                                    <div className="error-message">
                                        <img src={IconError} alt="error" className="ic-error" />
                                        {errors.password}
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="login">Register</button>

                            <div className="registerLink">
                                <p>Already have an account? <a href="#" className="register" onClick={loginLink}>Login</a></p>
                            </div>
                        </form>
                    </div>
            </div>
        </div>
    );
}

export default Login;