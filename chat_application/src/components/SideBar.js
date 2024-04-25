import { useEffect, useState, useRef } from "react"
import { useLogin } from "../LoginContext"
import { BaseUrl } from "../shared"
import axios from "axios"
import * as gearAnimation from "../animation/gear-animation.json"
import Lottie from "lottie-react"

export default function SideBar({triggerUserSetting}) {
    const [authInfo] = useLogin()
    const [userName, setUserName] = useState('')
    const lottieRef = useRef(null);

    const stopAnimation = () => {
        if (lottieRef.current) {
            lottieRef.current.stop(); 
        }
    } 
    const playAnimation = () => {
        if (lottieRef.current) {
            lottieRef.current.play(); 
        }
    }
    useEffect(() => {
        function getUserInfo() {
            console.log("Fetch user")
            const url = BaseUrl + `api/Account/User/${authInfo.userId}`
            axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                }
            }).then((response) => {
                if(response.status === 200) {
                    setUserName(response.data.userName)
                }
            })
        }
        stopAnimation()
        getUserInfo()
    }, [])

    return (
        <div className="sidebar bg-[#F2F3F5] z-[1]">
            <section className="flex bg-[#EBEDEF] panels">
                <div className="h-[52px] text-sm font-medium flex justify-between items-center px-[8px] relative w-full">
                    <div className="flex items-center min-w-[120px]">
                        <div className="avatar online">
                            <div className="w-[32px] h-[32px] rounded-full">
                                <img className="w-full h-full overflow-hidden cursor-pointer select-none" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                            </div>
                        </div>
                        <div className="py-[4px] pl-[8px]">
                            <div>
                                <div className="text-sm font-base leading-4 overflow-hidden whitespace-nowrap text-ellipsis">{userName}</div>
                            </div>
                            <div>
                                <div className="text-[12px] font-base leading-4 overflow-hidden whitespace-nowrap text-ellipsis">Trực tuyến</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-nowrap justify-start items-stretch">
                        <button className="cursor-pointer w-[32px] h-[32px] flex items-center justify-center rounded relative hover:bg-[#D7D8DC]"
                            onMouseEnter={playAnimation}
                            onMouseLeave={stopAnimation}
                            onClick={() => triggerUserSetting(true)}
                        >
                            <div className="w-full h-full">
                                <Lottie lottieRef={lottieRef} className="flex h-full w-full" animationData={gearAnimation} speed={4}/>
                            </div>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}