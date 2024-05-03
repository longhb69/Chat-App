import FriendIcon from "./FriendIcon"
import UserPanel from "./UserPanel"

export default function AccountSideBarMeta({triggerUserSetting}) {
    return (
        <>
            <UserPanel triggerUserSetting={triggerUserSetting}/>
            <div className="bg-[#F2F3F5] scrollerBase fade">
                <ul className="h-[496px] relative list-style-none">  
                    <li className="relative max-w-[224px] ml-[8px] block py-[1px] rounded"> 
                        <div className="pr-[8px] flex items-center w-full cursor-pointer hover:bg-[#D7D9DC]">
                            <a className="flex min-w-[0px] items-center gap-[8px] white-space-nowrap text-ellipsis overflow-hidden" style={{flex: "1 1 auto"}}>
                                <div className="min-w-[0px] flex items-center rounded h-[42px] py-0 px-[8px]">
                                    <div className="flex items-center justify-center w-[32px] h-[32px] mr-[12px]" style={{flex: "0 0 auto"}}>
                                        <svg class="w-[24px] h-[24px] overflow-hidden" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M13 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" class=""></path><path fill="currentColor" d="M3 5v-.75C3 3.56 3.56 3 4.25 3s1.24.56 1.33 1.25C6.12 8.65 9.46 12 13 12h1a8 8 0 0 1 8 8 2 2 0 0 1-2 2 .21.21 0 0 1-.2-.15 7.65 7.65 0 0 0-1.32-2.3c-.15-.2-.42-.06-.39.17l.25 2c.02.15-.1.28-.25.28H9a2 2 0 0 1-2-2v-2.22c0-1.57-.67-3.05-1.53-4.37A15.85 15.85 0 0 1 3 5Z" class=""></path></svg>
                                    </div>
                                    <div className="min-w-[0px] white-space-nowrap text-ellipsis overflow-hidden" style={{flex: "1 1 auto"}}>
                                        <div className="flex justify-center items-center">
                                            <div className="text-base white-space-nowrap text-ellipsis overflow-hidden font-medium" style={{flex: "0 1 auto"}}>
                                                Bạn bè
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </li>
                    <h2 className="flex pt-[18px] pr-[8px] ob-[4px] pl-[18px] h-[40px] container__43554 text-[#313338] cursor-default	">
                        <span className="overflow-hidden text-ellipsis flex-1">
                            Tin nhắn trực tiếp
                        </span>
                    </h2>
                    <FriendIcon/>
                </ul>
            </div>
        </>
    )
}