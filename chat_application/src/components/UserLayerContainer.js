import { useEffect, useRef } from "react"
import MyAccount from "./MyAccount";
import { useLogin } from "../LoginContext";
import { useNavigate } from "react-router-dom";

export default function UserLayerContainer({trigger, setTrigger}) {
    const layerRef = useRef()
    const [authInfo, setAuthInfo] = useLogin()
    const navigate = useNavigate()

    useEffect(() => {
        if(!authInfo.loggedIn) {
            navigate("/login")
        }
        const element = layerRef.current;
        if(element) {
            
        }
    }, [])

    const handleLogout = () => {
        setAuthInfo([])
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('userName')
        navigate("/login")
    }

    return ( trigger ? (
        <>
            <div ref={layerRef} className="absolute top-0 right-0 bottom-0 left-0 flex flex-col overflow-hidden bg-[#FFFFFF]">
                <div className="absolute top-0 right-0 bottom-0 left-0 z-[101] flex bg-[#FFFFFF]" style={{opacity: '1'}}>
                    <div className="flex z-1 justify-end sidebarRegion bg-[#F2F3F5]">
                        <nav className="w-[218px] py-[60px] pl-[20px] pr-[10px]">
                            <div className="flex flex-col text-base font-medium">
                                <div className="pb-[6px] px-[10px] whitespace-nowrap overflow-ellipsis overflow-hidden shrink-0 text-[#655E66]">
                                    <div className="text-xs font-semibold uppercase tracking-wide">Cài đặt người dùng</div>
                                </div>
                                <div className="py-[6px] px-[10px] mb-[2px] rounded bg-[#E0E1E5]">
                                    Tài Khoản Của Tôi
                                </div>
                                <div className="my-[8px] mx-[10px] h-[1px] bg-[#E0E1E5]"></div>
                                <div className="py-[6px] px-[10px] mb-[2px] rounded hover:bg-[#E0E1E5] cursor-pointer flex items-center justify-between"
                                    onClick={() => handleLogout()}>
                                    Đăng xuất
                                    <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M9 12a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1Z" class=""></path><path fill="currentColor" fill-rule="evenodd" d="M2.75 3.02A3 3 0 0 1 5 2h10a3 3 0 0 1 3 3v7.64c0 .44-.55.7-.95.55a3 3 0 0 0-3.17 4.93l.02.03a.5.5 0 0 1-.35.85h-.05a.5.5 0 0 0-.5.5 2.5 2.5 0 0 1-3.68 2.2l-5.8-3.09A3 3 0 0 1 2 16V5a3 3 0 0 1 .76-1.98Zm1.3 1.95A.04.04 0 0 0 4 5v11c0 .36.2.68.49.86l5.77 3.08a.5.5 0 0 0 .74-.44V8.02a.5.5 0 0 0-.32-.46l-6.63-2.6Z" clip-rule="evenodd" class=""></path><path fill="currentColor" d="M15.3 16.7a1 1 0 0 1 1.4-1.4l4.3 4.29V16a1 1 0 1 1 2 0v6a1 1 0 0 1-1 1h-6a1 1 0 1 1 0-2h3.59l-4.3-4.3Z" class=""></path></svg>
                                </div>
                                <div className="my-[8px] mx-[10px] h-[1px] bg-[#E0E1E5]"></div>
                            </div>
                        </nav>
                    </div>
                    <div className="contentRegion">
                        <div className="contentTransitionWrap">
                            <div className="contentRegionScroller">
                                <div className="max-w-[740px] pt-[60px] pr-[40px] pb-[80px] pl-[40px] min-w-[460px] min-h-[100%] flex_1_1">
                                    <MyAccount />
                                </div>
                                <div className="toolsContainer">
                                    <div className="fixed">
                                        <div className="flex flex-col items-center">
                                            <div className="closeButton text-[#33353A] border-[#33353A] hover:bg-[#C32148] transition" onClick={() => setTrigger(false)}>
                                                <svg aria-hidden="true" role="img" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
    : null
    )
}