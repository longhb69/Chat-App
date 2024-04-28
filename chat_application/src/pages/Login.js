import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useLogin } from "../LoginContext";
import { BaseUrl } from "../shared";
import axios from 'axios';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isValid, setIsValid] = useState(false)
    const [incorrect, setIncorrect] = useState(false)

    const [authInfo, setAuthInfo] = useLogin()
    const navigate = useNavigate()
    const label1Ref = useRef()
    const label2Ref = useRef()

    function login(e) {
        e.preventDefault();
        const url = BaseUrl + 'api/Account/login';
        axios.post(url, {
            username: username,
            password: password,
            remberMe: true,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('userName', response.data.userName);
            setAuthInfo({
                loggedIn: true,
                userId: response.data.userId,
                userName: response.data.userName,
            })
            navigate("/");
        }).catch((e) => {
            if (e.response && (e.response.status === 401 || e.response.status === 400)) {
                setIncorrect(true)
                console.log('Incorrect username or password');
            }
        });
    };

    function CheckValid() {
        if (username.trim() !== '' && password.trim() !== '') {
            setIsValid(true)
        } else {
            setIsValid(false)
        }
    }
    useEffect(() => {
        CheckValid()
    }, [[username, password]])

    function handleFocus1() {
        label1Ref.current.classList.add('move-up')
    }
    function handleBlur1() {
        if (username.trim() === '') label1Ref.current.classList.remove('move-up')
    }
    function handleFocus2() {
        label2Ref.current.classList.add('move-up')
    }
    function handleBlur2() {
        if (password.trim() === '') label2Ref.current.classList.remove('move-up')
    }

    return (
        <div className="login-container h-screen flex justify-center items-center">
            <div className="w-full h-[717px] text-center text-[#fff] top-to-bottom">
                <div className="max-w-[550px] w-[500px] inline-block text-left align-middle bg-[#313338] mt-20 m-8 rounded">
                    <div className="text-center pb-[60px] pt-[50px] px-[55px]">
                        <div className="text-center pb-[50px] pt-[40px] px-[45px]">
                            <div className="flex flex-col w-full max-w-[500px]">
                                <h6 className="text-center overflow-hidden text-lg font-medium">LOGIN</h6>
                                <form className="flex flex-col mx-auto w-full max-w-[350px] mt-5" onSubmit={login}>
                                    <div className="w-full h-[100px] inline-flex flex-col  relative">
                                        <label ref={label1Ref} className="label absolute -top-1 left-0">
                                            Username
                                        </label>
                                        <div className={` relative rounded w-full border bg-[#202020] ${incorrect ? 'border-red-500' : ' border-[#5532db]'}`}>
                                            <input
                                                type="text"
                                                name="username"
                                                className="h-[60px] p-6 pt-[30px] w-full pb-[10px] bg-transparent "
                                                value={username}
                                                onFocus={handleFocus1}
                                                onBlur={handleBlur1}
                                                onChange={(e) => {
                                                    setUsername(e.target.value)
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full h-[100px] inline-flex flex-col relative">
                                        <label ref={label2Ref} className="label absolute -top-1 left-0">
                                            Password
                                        </label>
                                        <div className={`cursor-text input-field relative rounded w-full border bg-[#202020] ${incorrect ? 'border-red-500' : ' border-[#5532db]'}`}>
                                            <input
                                                className="h-[60px] p-6 pt-[30px] w-full pb-[10px] bg-transparent transition ease-in-out duration-300 delay-[300ms]"
                                                type="password"
                                                name="password"
                                                onFocus={handleFocus2}
                                                onBlur={handleBlur2}
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value)
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {incorrect ? <p className="text-red-500 mb-2">Incorrect username or password</p> : null}
                                    <div
                                        className={`flex flex-col rounded w-full h-[40px] justify-center bg-[#5532db] text-sm hover:opacity-[0.9] transition ease-in duration-[120ms]  ${
                                            isValid ? '' : 'pointer-events-none' 
                                        }`}>
                                        <button className={`w-full font-medium  login-btn ${isValid ? '' : 'opacity-[0.5] cursor-default'}`} type="submit">
                                            Đăng nhập
                                        </button>
                                    </div>
                                </form>
                                <div className="mt-5 flex gap-4">
                                    <h1>Chưa có tài khoản?</h1>
                                    <div className="">
                                        <a href="/signup" className="text-[] hover:underline cursor-pointer">
                                            Đăng ký
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}