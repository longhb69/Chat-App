import { useEffect, useState } from "react"
import AddEmoji from "./AddEmoji"

export default function Emoji({emojis, messageId, chatRoomId, conn}) {
    const [emojisMap, setEmojisMap] = useState(new Map())

    useEffect(()=> {
       let emojiMap = new Map()
       emojis.map((emoji) => {
            const key = emoji.emojiSymbol
            if(emojiMap.has(key)) {
                let emoji_to_update = emojiMap.get(key)
                emoji_to_update.count += 1
            } else {
                let emojiObj = {count: 1, imageUrl: emoji.imageUrl}
                emojiMap.set(emoji.emojiSymbol, emojiObj)
            }
       })
       setEmojisMap(emojiMap)
    }, [emojis])

    const UpdateEmoji = (emoji) => {
        const newEmojiMap = new Map(emojisMap);
        const key = emoji.emojiSymbol
        if(newEmojiMap.has(key)) {
            let emoji_to_update = newEmojiMap.get(key)
            emoji_to_update.count += 1
        } else {
            let emojiObj = {count: 1, imageUrl: emoji.imageUrl}
            newEmojiMap.set(emoji.emojiSymbol, emojiObj)
        }
        setEmojisMap(newEmojiMap)
    } 

    return (
        <div className="flex items-cent er gap-2 emoji-container items-center flex-nowrap justify-self-start self-start" style={{flex: "1 0 auto"}}>
            {emojisMap.size > 0 && Array.from(emojisMap).map(([key, value]) => {
                return (
                    <div className="w-[45px] h-[24px] bg-[#E2E4F7] rounded  border-[1px] border-[#5865F2] flex justify-between items-center p-2 cursor-pointer">
                        <div>
                            <img className="w-[1rem] h-[1rem] object-contain" src={value.imageUrl}/>
                        </div>
                        <div className="text-sm text-[#5865F2] font-bold">{value.count}</div>
                    </div>
                )
            })} 
            <div className="add-emoji">
                <AddEmoji messageId={messageId} height={16} width={16} position={'small-emojiPiker-container-right-side'} UpdateEmoji={UpdateEmoji} chatRoomId={chatRoomId} conn={conn} bottom={true}/>
            </div>
        </div>
    )
}