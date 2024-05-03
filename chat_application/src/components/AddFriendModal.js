import { useEffect, useRef, useState } from "react"
import { BaseUrl } from "../shared";
import axios from "axios";
import Lottie from "lottie-react";
import * as animationData from "../animation/loading-cricle-2 - 1704876191134.json";

export default function AddFriendModal() {
    const inputContainerRef = useRef()
    const [query, setQuery] = useState('');
    const [result, setResult] = useState();
    const [loading, setLoading] = useState(false)

    const handleInputChange = debounce((event) => {
        setQuery(event.target.value);
    });

    function debounce(cb, delay = 1000) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            setLoading(true)
            timeout = setTimeout(() => {
                cb(...args)
            }, delay)
        }
    }

    useEffect(() => {
        if (query.trim() !== "") {
            fetchData();
        } else {
            setLoading(false)
            setResult()
        }
    }, [query])

    const fetchData = async () => {
        const url = BaseUrl + `api/user_by_name/${query}`;
        try {
            const respone = await axios.get(url)
            const data = await respone.data;
            setResult(data)
            setLoading(false)
        } catch (e) {
            console.log(e)
        }
    }

    const handleFocus = () => {
        if(inputContainerRef.current) {
            inputContainerRef.current.classList.remove("border-[#C2C3C8]")
            inputContainerRef.current.classList.add("border-[#2a2ab5]")
        }
    }

    const handleBlur = () => {
        if(inputContainerRef.current) {
            inputContainerRef.current.classList.remove("border-[#2a2ab5]")
            inputContainerRef.current.classList.add("border-[#C2C3C8]")
        }
    }

    return (
        <>
            <header className="shirk-0 py-[20px] px-[30px] border-b-[1px]">
                <h2 className="mb-[8px] text-base font-semibold uppercase">Thêm Bạn</h2>
                <div ref={inputContainerRef} className="flex items-center border-[1px] rounded-[8px] mt-[16px] px-[12px] relative bg-[#E3E5E8] border-[1px] border-[#C2C3C8]">
                    <div className="flex flex-col flex-auto mr-[16px] py-[4px] z-1 text-base font-medium whitespace-pre	">
                        <input className="w-full rounded-[3px] transition h-[40px] bg-transparent outline-none"
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            onChange={(event) => handleInputChange(event)}
                        />
                    </div>
                </div>
            </header>
            <div className="h-full">
                {loading ? 
                    <div className="h-full flex justify-center my-[100px]">
                        <Lottie className="w-[100px] h-[100px]" animationData={animationData} loop={true}/>
                    </div>
                : 
                    <ul className="flex flex-col px-[30px] py-[10px] gap-y-5">
                        {result && result.length > 0 ?
                            <>
                                {result.map((user, index) => {
                                    return (
                                        <li className="flex h-[50px] items-center ">
                                            <div className="avatar online mr-[12px]">
                                                <div className="w-[40px] h-[40px] rounded-full">
                                                    <img className="w-full h-full overflow-hidden cursor-pointer select-none" src="https://chatapp-long-1.s3.ap-southeast-1.amazonaws.com/7f15142d4ff388f352cd.webp"/>
                                                </div>
                                            </div>
                                            <div className="font-medium mr-[100px] w-[100px] shrink-0 text-ellipsis">{user.userName}</div>
                                            <button class="btn btn-sm btn-primary h-[32px] ml-[20px]" onClick={() => { }}>
                                                <div className="my-auto whitespace-nowrap overflow-hidden text-ellipsis">
                                                    Gửi Yêu Cầu Kết Bạn
                                                </div>
                                            </button>
                                        </li>
                                    )
                                })}
                            </>
                        : null}
                    </ul>
                }
            </div>
        </>
    )
}