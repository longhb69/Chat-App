import { useEffect, useState } from "react"
import AddChatRoomModal from "./AddChatRoomModal";
import UseFetchData from "../UseFetchData";
import { BaseUrl } from "../shared";
import { Button } from "react-bootstrap";
import { useLogin } from "../LoginContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Link } from "react-router-dom";

export default function Rooms({ conn, JoinSpecificChatRoom, GoToAccountChannel, currentRoomId }) {
    const [authInfo, setAuthInfo] = useLogin();
    const url = BaseUrl + `api/userchatroom/${authInfo.userId}`
    //const url = BaseUrl + `api/chatroom`;
    const { data: rooms, loading, error, refetch } = UseFetchData(url);
    const [btnAddChatRoom, setBtnAddChatRoom] = useState(false);

    const addChatRoom = () => {
        setBtnAddChatRoom(true);
    }
    // useEffect(() => {
    //     conn.on("AddedToChatRoom", (chatRoomId) => {
    //         refetch();
    //         console.log("You just add to another chatroom");
    //     })
    // }, [conn]);
    //#E3E5E8
    return <nav className="flex flex-col gap-2 items-center pt-3 pb-3 pl-3 pr-2 bg-gradient-to-t from-[#F4AA8B] to-[#F7CB78] shrink-0">
        <div className="relative flex items-center justify-center room-container">
            <div className={`${currentRoomId === -1 ? `active-bar-selected` : `active-bar`}`}></div>
            <Link
                className="w-[55px] h-[55px]"
                to={`/channels/me`}>
                <div className={`w-full h-full flex justify-center items-center border-rounded-animation  ${currentRoomId === -1 ? `bg-[#5865F2]` : ` bg-[#fff]`} hover:bg-[#5865F2]`}>
                    <span>You</span>
                </div>
            </Link>
        </div>
        {rooms.map((r, index) => {
            return (
                <div className="relative flex items-center justify-center room-container">
                    <div className={`${currentRoomId === r.id ? `active-bar-selected` : `active-bar`}`}></div>
                    <Link
                        className="w-[55px] h-[55px]"
                        //onClick={() => JoinSpecificChatRoom(authInfo.userId, r.id)}
                        to={`/channels/${r.id}`}
                    >
                        {r.imageUrl ? <img src={r.imageUrl} className="object-cover w-full h-full flex justify-center items-center border-rounded-animation" />
                            : <div className={`w-full h-full flex justify-center items-center border-rounded-animation ${currentRoomId === r.id ? `bg-[#5865F2]` : ` bg-[#fff]`} hover:bg-[#5865F2]`}>
                                <div className={`text-xl`}>{r.name[0]}</div>
                            </div>}
                    </Link>
                    <div className=" hover-room-name absolute start-16 font-semibold z-[2]">
                        <div className="pointer z-[2]"></div>
                        <div className="room-name-box bg-[#fff]">{r.name}</div>
                    </div>
                </div>
            );
        })}
        <div className="flex justify-center w-[55px] h-[55px] room-container group">
            <div className="w-full h-full bg-[#fff] hover:cursor-pointer flex items-center justify-center border-rounded-animation group-hover:bg-[#23A559]" onClick={addChatRoom}>
                <FontAwesomeIcon icon={faPlus} size="2xl" className="text-[#23A559] group-hover:text-[#fff]" />
            </div>
        </div>
        <div className="w-[60%] h-[2px] bg-[#CCCED3]"></div>
        <AddChatRoomModal
            trigger={btnAddChatRoom}
            setTrigger={setBtnAddChatRoom}
            refetch={refetch}
        />
    </nav>
}