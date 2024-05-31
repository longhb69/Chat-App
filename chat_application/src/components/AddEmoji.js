import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { BaseUrl } from "../shared";
import axios from "axios";
import { useLogin } from "../LoginContext";

export default function AddEmoji({messageId}) {

    const [addEmoji, setAddEmoji] = useState(false)
    const [authInfo] = useLogin()

    const handleEmoji = async e => {
        const url = BaseUrl + `api/emoji/${authInfo.userId}/${messageId}/${e.names[0]}/${encodeURIComponent(e.imageUrl)}`
        console.log(e.imageUrl)
        try {
            const response = await axios.post(url)
            console.log(response)
        } catch(e) {
            console.log(e)
        }
        console.log(e)
    }

    return (
        <div className="relative" onClick={() => setAddEmoji(!addEmoji)}>
            <div className="mt-2 w-[25px] h-[25px] cursor-pointer mx-[.25rem] mb-[.125rem]">
                <svg class="w-[25px] h-[25px]" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M12 23a11 11 0 1 0 0-22 11 11 0 0 0 0 22ZM6.5 13a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm-9.8 1.17a1 1 0 0 1 1.39.27 3.5 3.5 0 0 0 5.82 0 1 1 0 0 1 1.66 1.12 5.5 5.5 0 0 1-9.14 0 1 1 0 0 1 .27-1.4Z" clip-rule="evenodd" class=""></path></svg>
            </div>
            <EmojiPicker height={500} lazyLoadEmojis={true} open={addEmoji} 
                className="emojiPiker-container-left-side"
                onEmojiClick={(e) => handleEmoji(e)}/>
        </div>
    )
}