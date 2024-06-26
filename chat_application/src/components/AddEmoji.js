import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { BaseUrl } from "../shared";
import axios from "axios";
import { useLogin } from "../LoginContext";
import { eventarc } from "googleapis/build/src/apis/eventarc";

export default function AddEmoji({messageId, width, height, position, UpdateEmoji, chatRoomId, conn}) {
    const [addEmoji, setAddEmoji] = useState(false)
    const [authInfo] = useLogin()
    const emojiPikersRef = useRef()

    const handleEmoji = async (e) => {
        const newEmoji = await CreateEmoji(e)
        console.log(newEmoji)
        UpdateEmoji(newEmoji)
        conn.invoke("NotifyEmoji", chatRoomId, newEmoji.id, messageId)
    }
    const CreateEmoji = async (e) => {
        const url = BaseUrl + `api/emoji/${authInfo.userId}/${messageId}/${e.names[0]}/${encodeURIComponent(e.imageUrl)}`
        try {
            const response = await axios.post(url)
            setAddEmoji(false)
            if(response.status === 201) {
                return response.data
            }
        } catch (e) {
            console.log(e)
        }
    }
    const handleClick= (event) => {
        if(!emojiPikersRef.current.contains(event.target)) setAddEmoji(false)
    }

    //const handleEmojiDirect = async (e) => {
        //const newEmoji = await CreateEmoji(e)
        //AddNewEmoji(newEmoji)
    //}

    useEffect(() => {
        if(addEmoji) {
            document.body.addEventListener('click', handleClick)
        }
        return () => {
            document.body.removeEventListener('click', handleClick)
        }
    }, [addEmoji])

    return (
        <div ref={emojiPikersRef} className="relative max-h-fit">
            <div className="" onClick={() => setAddEmoji(!addEmoji)}>
                <div className={`w-[${width}] h-[${height}] cursor-pointer mx-[.25rem] mb-[.125rem]`}>
                    <svg class="w-full h-full" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M12 23a11 11 0 1 0 0-22 11 11 0 0 0 0 22ZM6.5 13a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm-9.8 1.17a1 1 0 0 1 1.39.27 3.5 3.5 0 0 0 5.82 0 1 1 0 0 1 1.66 1.12 5.5 5.5 0 0 1-9.14 0 1 1 0 0 1 .27-1.4Z" clip-rule="evenodd" class=""></path></svg>
                </div>
            </div>
            <EmojiPicker height={500} lazyLoadEmojis={true} open={addEmoji} 
                    className={position}
                    onEmojiClick={(e) => handleEmoji(e)}
            />
        </div>
    )
}