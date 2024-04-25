import React, { useState, useRef, useEffect } from 'react'
import { faCamera } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from 'axios'
import { BaseUrl } from '../shared'
import { useLogin } from '../LoginContext'
import Lottie from "lottie-react";
import * as animationData from "../animation/Animation - 1709728204842.json"



export default function AddChatRoomModal(props) {
    const [chatRoomName, setChatRoomName] = useState();
    const [preview, setPreview] = useState('');
    const [authInfo, setAuthInfo] = useLogin()
    const [imageSelected, setImageSelected] = useState();
    const formRef = useRef(null);
    const inputRef = useRef(null);
    const addChatRoomBtnRef = useRef(null);


    useEffect(() => {
        if (imageSelected) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result)
            }
            reader.readAsDataURL(imageSelected)
        } else {
            setPreview(null)
        }
    }, [imageSelected])

    const AddChatRoom = async (e) => {
        e.preventDefault();
        addChatRoomBtnRef.current.classList.add('loading-image')
        const data = {
            name: chatRoomName,
            ownerId: authInfo.userId
        };
        const url = BaseUrl + 'api/chatroom';
        try {
            const imageUrl = await uploadImage();
            data.imageUrl = imageUrl
        } catch (error) {
            console.log("Error uploading image: ", error)
        }
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        };
        try {
            const response = await axios.post(url, data, config)
            if (response.status === 201) {
                props.setTrigger(false)
                addChatRoomBtnRef.current.classList.remove('loading-image')
                props.refetch();
            }
        } catch (error) {
            console.error('Error creating chat rooom:', error);
        }
        finally {
            setImageSelected(null)
            setChatRoomName('')
            setPreview('')
        }
    }
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.substr(0, 5) === 'image') {
            setImageSelected(event.target.files[0]);
        }
        else {
            setImageSelected(null)
        }
    }
    const uploadImage = async () => {
        try {
            const formData = new FormData();
            formData.append("file", preview)
            formData.append("upload_preset", "chat_appasdfsdf")
            const respone = await axios.post("https://api.cloudinary.com/v1_1/dfo61m8dy/image/upload", formData)
            return respone.data.secure_url;
        } catch (error) {
            return null;
        }
    };

    const handleClose = () => {
        props.setTrigger(false)
        setImageSelected(null)
        setChatRoomName('')
        setPreview('')
    }

    return (
        <div className={`modal-overlay ${props.trigger ? 'show' : 'hidden'}`} >
            <div className={`z-[998] w-full h-full flex justify-center mx-auto modal-form rounded  ${props.trigger ? 'show flex' : 'scale-out'}`}>
                <div className="w-[25%] my-auto text-text-color px-1 py-3 bg-main-color rounded">
                    <form ref={formRef} className='flex flex-col px-3 py-1 relative' onSubmit={AddChatRoom}>
                        <div className='flex justify-center text-heading-color'>
                            <h3>Customize Your Chat Room</h3>
                        </div>
                        <div className='text-center'>
                            <p>Hãy cá nhân hóa phòng chat bằng cách đặt tên và thêm biểu tượng đại diện. Bạn có thể thay đổi bất cứ lúc nào.</p>
                        </div>
                        <div className='flex justify-center' onClick={() => inputRef.current.click()}>
                            <input ref={inputRef} type="file" accept='image/*' id="myfile" name="myfile" className='hidden' onChange={handleImageChange} />
                            {preview && preview.length > 0
                                ?
                                <div className='w-[90px] h-[90px] rounded-full relative flex justify-center hover:cursor-pointer'>
                                    <img src={preview} className="w-full h-hull rounded-full object-cover" />
                                </div>
                                :
                                <div className='w-[90px] h-[90px] rounded-full relative border-dashed border-2 border-text-color flex justify-center hover:cursor-pointer'>
                                    <div className='absolute -top-1 right-0 w-[25px]'>
                                        <div className='rounded-full bg-[#B197Fc] text-center'>
                                            <FontAwesomeIcon icon={faPlus} style={{ color: 'white' }} />
                                        </div>
                                    </div>
                                    <div className='my-auto mx-auto'>
                                        <div className='flex justify-center'><FontAwesomeIcon icon={faCamera} style={{ color: "#B197Fc", }} size="2xl" /></div>
                                        <div className='font-bold text-sm'>Upload</div>
                                    </div>
                                </div>
                            }
                        </div>
                        <div>
                            <label>Tên phòng Chat</label>
                            <div>
                                <input
                                    className='w-full outline-none p-2.5 bg-form-background mt-2'
                                    value={chatRoomName}
                                    onChange={(e) => {
                                        setChatRoomName(e.target.value);
                                    }}
                                    name="chatroomname"
                                />
                            </div>
                        </div>
                        <div className='absolute top-0 right-3 hover:cursor-pointer' onClick={() => handleClose()}>
                            <FontAwesomeIcon icon={faX} />
                        </div>
                        <div className='flex justify-end mt-3 text-[#fff] '>
                            <button ref={addChatRoomBtnRef} className='w-[80px] h-[45px] max-h-[45px] p-2 rounded bg-[#5532db]/[.8] hover:bg-[#5532db]/[.9] transition ease-in duration-[100ms]' type='submit'>
                                <Lottie className='lottie w-full h-full scale-[2]' animationData={animationData} loop={true} />
                                <span className='preload-text'>Tạo</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div >

        </div >
    )
}

