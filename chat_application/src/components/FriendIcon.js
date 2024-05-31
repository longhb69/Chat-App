import { useEffect, useState } from "react"
import { BaseUrl } from "../shared"
import axios from "axios"
import { useLogin } from "../LoginContext"

export default function FriendIcon() {
    const [authInfo] = useLogin()
    const [friends, setFriends] = useState()

    useEffect(() => {
        const url = BaseUrl + `api/getFriends/${authInfo.userId}`
            axios.get(url).then(response => {
                setFriends(response.data)
                console.log(url)
                console.log(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }, [])

    return (
        <>
            {friends && friends.length > 0 ?
                <>
                    {friends.map((friend, idx) => {
                        return (
                            <li key={idx} className="relative max-w-[224px] ml-[8px] block py-[1px] rounded">
                                <div className="flex items-center w-full cursor-pointer rounded hover:bg-[#D7D9DC]">
                                    <a className="flex min-w-[0px] items-center gap-[8px] white-space-nowrap text-ellipsis overflow-hidden" style={{flex: "1 1 auto"}}>
                                        <div className="min-w-[0px] flex items-center rounded h-[42px] py-0 px-[8px]">
                                            <div className="avatar online mr-[12px]">
                                                <div className="w-[32px] h-[32px] rounded-full">
                                                    <img className="w-full h-full overflow-hidden cursor-pointer select-none" src={friend.avatarUrl ? `${friend.avatarUrl}` : `https://chatapp-long-1.s3.ap-southeast-1.amazonaws.com/7f15142d4ff388f352cd.webp`}/>
                                                </div>
                                            </div>
                                            <div className="min-w-[0px] white-space-nowrap text-ellipsis overflow-hidden" style={{flex: "1 1 auto"}}>
                                                <div className="flex justify-center items-center">
                                                    <div className="text-base white-space-nowrap text-ellipsis overflow-hidden font-medium" style={{flex: "0 1 auto"}}>
                                                        {friend.userName}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </li>
                        )
                    })}
                </> 
            :null}
        </>
    )
}