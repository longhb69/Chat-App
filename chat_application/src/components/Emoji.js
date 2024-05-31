import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons"
import EmojiPicker from "emoji-picker-react"
import { BaseUrl } from "../shared"
import { useLogin } from "../LoginContext"
import axios from "axios"

export default function Emoji({emojis, messageId}) {

    const [emojiList, setEmojiList] = useState({})
    const [addEmoji, setAddEmoji] = useState(false)
    const [authInfo] = useLogin()

    useEffect(()=> {
        const EmojiCount = {};
        emojis.forEach(emoji => {
            if (EmojiCount[emoji.emojiSymbol]) {
                EmojiCount[emoji.emojiSymbol] += 1;
            } else {
                EmojiCount[emoji.emojiSymbol] = 1;
            }
        })
        setEmojiList(EmojiCount)
    }, [])

    const renderEmoji = (symbol, count) => {
        switch (symbol) {
            case "like":
                return (
                    <>
                        <div>
                            <FontAwesomeIcon icon={faThumbsUp} size="sm" style={{color: "#FAB004"}} />
                        </div>
                        <div className="text-sm text-[#5865F2] font-bold">
                            {count}
                        </div>
                    </>
                )
            default:
                return null;
        }
    }

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
        <div className="flex items-cent er gap-2 emoji-container items-center flex-nowrap justify-self-start self-start" style={{flex: "1 0 auto"}}>
            {/* {Object.entries(emojiList).map(([symbol, count]) => {
                return (
                    <div className="w-[45px] h-[24px] bg-[#E2E4F7] rounded  border-[1px] border-[#5865F2] flex justify-between items-center p-2 cursor-pointer">
                        {renderEmoji(symbol, count)}
                    </div>
                )
            })} */}
            {emojis.map((emoji, idx) => {
                return (
                    <div className="w-[45px] h-[24px] bg-[#E2E4F7] rounded  border-[1px] border-[#5865F2] flex justify-between items-center p-2 cursor-pointer">
                        <div>
                            <img className="w-[1rem] h-[1rem] object-contain" src={emoji.imageUrl}/>
                        </div>
                    </div>
                )
            })}
            <div className="relative" onClick={() => setAddEmoji(!addEmoji)}>
                <div className="w-[1rem] h-[1rem] cursor-pointer mx-[.25rem] mb-[.125rem] add-emoji">
                    <svg class="w-[1rem] h-[1rem]" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M12 23a11 11 0 1 0 0-22 11 11 0 0 0 0 22ZM6.5 13a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm-9.8 1.17a1 1 0 0 1 1.39.27 3.5 3.5 0 0 0 5.82 0 1 1 0 0 1 1.66 1.12 5.5 5.5 0 0 1-9.14 0 1 1 0 0 1 .27-1.4Z" clip-rule="evenodd" class=""></path></svg>
                </div>
                <EmojiPicker height={500} lazyLoadEmojis={true} open={addEmoji} 
                    className="emojiPiker-container-left-side"
                    onEmojiClick={(e) => handleEmoji(e)}/>
            </div>
        </div>
    )
}