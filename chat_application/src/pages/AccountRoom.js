import { useEffect, useState } from "react";
import AddFriendModal from "../components/AddFriendModal";
import { BaseUrl } from "../shared";
import { useLogin } from "../LoginContext";
import axios from "axios";

export default function AccountRoom({conn}) {
    const [activeTab, setActiveTab] = useState(1);

    const RequestedPending = () => {
        const [authInfo] = useLogin()
        const [request, setRequest] = useState()

        useEffect(() => {
            const url = BaseUrl + `api/friendship/${authInfo.userId}`
            axios.get(url).then(response => {
                setRequest(response.data)
            })
            .catch(error => {
                console.log(error)
            })
        }, [])
        
        return (
            <ul className="flex flex-col px-[30px] py-[10px] gap-y-5">
                {request && request.length > 0 ? 
                    <> 
                        {request.map((user) => {
                            return (
                                <li className="flex h-[50px] items-center hover:bg-[#E3E5E8] p-2 rounded-lg transition">
                                    <div className="avatar online mr-[12px]]">
                                        <div className="w-[40px] h-[40px] rounded-full">
                                            <img className="w-full h-full overflow-hidden cursor-pointer select-none" src="https://chatapp-long-1.s3.ap-southeast-1.amazonaws.com/7f15142d4ff388f352cd.webp"/>
                                        </div>
                                    </div>
                                    <div className="ml-2 font-medium mr-[100px] w-[100px] shrink-0 text-ellipsis">{user.userName}</div>
                                </li>
                            )
                        })}
                    </>
                : null}
            </ul>
        )
    }

    const handleActiveTab = (index) => {
        setActiveTab(index)
    }
 
    const renderTabContent = () => {
        switch (activeTab) {
            case 1: 
                return <RequestedPending />
            case 2:
                return <AddFriendModal />
            default:
                return null;
        }
    };

    return (
        <main className="w-full overflow-hidden flex flex-col">
            <section className="bg-[#fff] container__26baa border-b">
                <div className="flex flex-1">
                    <div className="relative flex-auto flex items-center min-w-[0px] overflow-hidden select-none">
                        <div className="relative h-[24px] w-auto mx-[8px]" style={{flex: "0 0 auto"}}>
                            <svg x="0" y="0" class="block w-[24px] h-[24px]" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M13 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" class=""></path><path fill="currentColor" d="M3 5v-.75C3 3.56 3.56 3 4.25 3s1.24.56 1.33 1.25C6.12 8.65 9.46 12 13 12h1a8 8 0 0 1 8 8 2 2 0 0 1-2 2 .21.21 0 0 1-.2-.15 7.65 7.65 0 0 0-1.32-2.3c-.15-.2-.42-.06-.39.17l.25 2c.02.15-.1.28-.25.28H9a2 2 0 0 1-2-2v-2.22c0-1.57-.67-3.05-1.53-4.37A15.85 15.85 0 0 1 3 5Z" class=""></path></svg>
                        </div>
                        <div className=" mr-[8px] min-w-[auto]" style={{flex: "0 0 auto"}}>
                            <h1 className="text-base font-semibold">Bạn bè</h1>
                        </div>
                        <div className="h-[70%] border-r border-[1px] border-[#EBEBED] mx-4"></div>
                        <div tabIndex={-1} className={`mr-[8px] py-1 px-2 rounded min-w-[auto] ${activeTab === 1 ? 'bg-[#EBEBED] text-[#121212] cursor-auto' : 'hover:bg-[#EBEBED] hover:text-[#121212] cursor-pointer'}`} style={{flex: "0 0 auto"}}
                            onClick={() => handleActiveTab(1)}>
                            <h1 className="text-base ">Đang chờ sử lý</h1>
                        </div>
                        <div className="w-[1px] h-[24px] my-[8px] bg-[#EBEBED]" style={{flex: "0 0 auto"}}></div>
                        <div tabIndex={-1} className="flex"
                            onClick={() => handleActiveTab(2)}>
                            <div className="item__48dda topPill__63ad4 tabBar__73938 text-[#fff] bg-[#248146]">
                                <span>Thêm Bạn</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="h-full flex relative overflow-hidden">
                <div className="flex flex-col flex-auto overflow-hidden">
                    {renderTabContent()}
                </div>
            </div>
        </main>
    )
}