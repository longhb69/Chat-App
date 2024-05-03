import { useEffect, useState, useRef } from "react"
import { useLogin } from "../LoginContext"
import { BaseUrl } from "../shared"
import axios from "axios"
import * as gearAnimation from "../animation/gear-animation.json"
import Lottie from "lottie-react"
import { useNavigate } from "react-router-dom"

export default function RoomSideBarMeta({triggerUserSetting}) {
    const lottieRef = useRef(null);
    const [authInfo] = useLogin()
    const [user, setUser] = useState()

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

    const navigate = useNavigate()

    useEffect(() => {
        function getUserInfo() {
            const url = BaseUrl + `api/Account/User/${authInfo.userId}`
            axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                }
            }).then((response) => {
                if(response.status === 200) {
                    setUser(response.data)
                }
            })
        }
        stopAnimation()
        if(!authInfo.loggedIn) {
            navigate("/login")
        }
        else {
            getUserInfo()
        }
    }, [])

    return (
        <section className="flex bg-[#EBEDEF] panels">
                <div className="h-[52px] text-sm font-medium flex justify-between items-center px-[8px] relative w-full">
                    <div className="flex items-center min-w-[120px]">
                        {user ? 
                            <>
                                <div className="avatar online">
                                    <div className="w-[32px] h-[32px] rounded-full">
                                        <img className="w-full h-full overflow-hidden cursor-pointer select-none" src={user.avatarUrl} />
                                    </div>
                                </div>
                                <div className="py-[4px] pl-[8px]">
                                    <div>
                                        <div className="text-sm font-base leading-4 overflow-hidden whitespace-nowrap text-ellipsis">{user.userName}</div>
                                    </div>
                                    <div>
                                        <div className="text-[12px] font-base leading-4 overflow-hidden whitespace-nowrap text-ellipsis">Trực tuyến</div>
                                    </div>
                                </div>
                            </>
                        : null}
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
    )
}