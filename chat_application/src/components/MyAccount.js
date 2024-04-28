import { useEffect, useState } from "react"
import { useLogin } from "../LoginContext"
import { BaseUrl } from "../shared"
import axios from "axios"

export default function MyAccount() {
    const [authInfo, setAuthInfo] = useLogin()
    const [user, setUser] = useState()
    useEffect(() => {
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
    }, [])
    return (
        user ? (
            <div>
                <div>
                    <div className="flex">
                        <h2 className="mb-[20px] text-lg line-[24px] font-semibold cursor-default">Tài khoản của tôi</h2>
                    </div>  
                    <div className="flex flex-col">
                        <div className="rounded-md overflow-hidden relative bg-[#E3E5E8]">
                            <div className="w-[80px] h-[80px] absolute top-[2px] left-[22px]">
                                <div className="avatar online">
                                    <div className="w-full h-full rounded-full">
                                        <img className="w-full h-full overflow-hidden select-none" src={user.avatarUrl} />
                                    </div>
                                </div>
                            </div>
                            <div className="h-[72px] w-full flex justify-between pt-[16px] pr-[16px] pb-0 pl-[120px] ">
                                <div>
                                    <div className="flex">
                                        <div className="mb-[6px] text-lg line-[24px] font-semibold">
                                            <span>
                                                {user.userName}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
        : null
    )
}