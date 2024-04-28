import React, { useEffect, useRef, useState } from 'react'
import { BaseUrl } from '../shared'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


export default function SignUp() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [incorrect, setIncorrect] = useState(false)
    const [notValid, setNotValid] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const [isValid, setIsValid] = useState(false)
    const label1Ref = useRef()
    const label2Ref = useRef()
    const label3Ref = useRef()
    const navigate = useNavigate()

    function createUser(e) {
        e.preventDefault()
        console.log(username)
        const url = BaseUrl + 'api/Account/register'
        axios.post(url, {
            username: username,
            email: email,
            password: password,
            confirmPassword: password
        })
        .then((response) => {
            if(response.status === 200) {
                navigate("/login")
            }
        })
        .catch((error) => {
            setErrorMessage(error.response.data.message)
        })
    }

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
    function handleFocus3() {
        label3Ref.current.classList.add('move-up')
    }
    function handleBlur3() {
        if (email.trim() === '') label3Ref.current.classList.remove('move-up')
    }
    return (
        <div className="login-container h-screen flex justify-center items-center">
            <div className="w-full h-[717px] text-center text-[#fff] top-to-bottom">
                <div className="max-w-[550px] w-[500px] inline-block text-left align-middle bg-[#202020] mt-20 m-8 rounded">
                    <div className="text-center pb-[60px] pt-[50px] px-[45px] h-full">
                        <div className="flex flex-col w-full max-w-[500px]">
                            <h6 className="text-center overflow-hidden text-lg">Tạo tài khoản</h6>
                            <form className="flex flex-col mx-auto w-full max-w-[350px] mt-5" onSubmit={createUser}>
                                <div className="w-full h-[100px] inline-flex flex-col relative">
                                    <label ref={label3Ref} className="label absolute top-0 left-0">
                                        Email
                                    </label>
                                    <div className="input-field relative rounded w-full border border-[#5532db]">
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            onFocus={handleFocus3}
                                            onBlur={handleBlur3}
                                            className="login-input-field h-[60px] p-6 pt-[30px] w-full pb-[10px] bg-transparent "
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value)
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="w-full h-[100px] inline-flex flex-col relative">
                                    <label ref={label1Ref} className="label absolute top-0 left-0">
                                        Username
                                    </label>
                                    <div className={`input-field relative rounded w-full border ${notValid ? 'border-red-500' : 'border-[#5532db]'}`}>
                                        <input
                                            type="text"
                                            name="username"
                                            onFocus={handleFocus1}
                                            onBlur={handleBlur1}
                                            className="login-input-field h-[60px] p-6 pt-[30px] w-full pb-[10px] bg-transparent "
                                            value={username}
                                            onChange={(e) => {
                                                setUsername(e.target.value)
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="w-full h-[100px] inline-flex flex-col relative cursor-text">
                                    <label ref={label2Ref} className="label absolute top-0 left-0">
                                        Password
                                    </label>
                                    <div className={`input-field relative rounded w-full border ${notValid ? 'border-red-500' : 'border-[#5532db]'}`}>
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
                                {errorMessage.length > 1 ? <p className="text-red-500 mb-5">{errorMessage}</p> : null}
                                <div
                                    className={`flex flex-col rounded w-full h-[40px] justify-center bg-[#5532db] text-sm hover:opacity-[0.9] transition ease-in duration-[120ms]  ${
                                        isValid ? '' : 'pointer-events-none'
                                    }`}>
                                    <button className={`w-full font-medium login-btn ${isValid ? '' : 'opacity-[0.5] cursor-default'}`} type="submit">
                                        Đăng ký
                                    </button>
                                </div>
                            </form>
                            <div className="mt-5 flex mx-auto">
                                <div className="">
                                    <a href="/login" className="text-[] hover:underline cursor-pointer">
                                        Đã có tài khoản
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
