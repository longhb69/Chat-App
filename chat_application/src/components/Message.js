import { useEffect, useState } from "react";
import embedRegexes from "../utils/embedRegexes ";
import LinkRender from "./LinkRender";
import AttachmentRender from "./AttachmentRender";
import Emoji from "./Emoji";
import EmojiPicker from "emoji-picker-react";
import AddEmoji from "./AddEmoji";

export default function Message({ message, premessage, idx }) {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const timezoneOffset = new Date().getTimezoneOffset()
    var date = new Date(message.timestamp);
    var prevmdate = premessage === null ? null : new Date(premessage.timestamp);
    const [link, setLink] = useState(false)
    const [type, setType] = useState('')
    const [addEmoji, setAddEmoji] = useState(false)

    useEffect(() => {
        if (prevmdate !== null && !message.newmsg) {
            date.setMinutes(date.getMinutes() - timezoneOffset);
            prevmdate.setMinutes(prevmdate.getMinutes() - timezoneOffset);
        } else {
            if (prevmdate !== null && !premessage.newmsg) prevmdate.setMinutes(prevmdate.getMinutes() - timezoneOffset);
        }
        if(message.content) {
            embedRegexes.some(({ regex, type }) => {
            const match = message.content.match(regex)   
                if (match) {
                    setLink(true);
                    setType(type);
                    return true;
                }
                return false
            })
        }
    }, [])

    const isTenMinuteGap = () => {
        let tenMinuteGap = false;
        if (prevmdate !== null && prevmdate.getFullYear() === date.getFullYear() && prevmdate.getMonth() === date.getMonth() && prevmdate.getDate() === date.getDate()) {
            if (date.getHours() === prevmdate.getHours()) {
                if (date.getMinutes() - prevmdate.getMinutes() <= 10) {
                    tenMinuteGap = true
                }
            }
            else if (date.getHours() === prevmdate.getHours() + 1) {
                const gap = date.getMinutes() - prevmdate.getMinutes();
                if (gap <= -50) {
                    tenMinuteGap = true;
                }
            }
        }
        return tenMinuteGap;
    }
    const isDayGap = () => {
        let dayGap = false;
        if (prevmdate !== null && (prevmdate.getDate() < date.getDate() || idx === 0))
            dayGap = true

        return dayGap
    };

    const formatTimestamp = () => {
        var formattedDate = '';
        if (!isTenMinuteGap()) {
            if (date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear()) {
                formattedDate = `Hôm nay lúc ${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`
            } else if (date.getDate() === yesterday.getDate() &&
                date.getMonth() === yesterday.getMonth() &&
                date.getFullYear() === yesterday.getFullYear()) {
                formattedDate = `Hôm qua lúc ${date.getHours()}:${(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()}`;
            }
            else {
                formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;
            }
        } else {
            formattedDate = `${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`
        }
        return formattedDate;
    };

    return (
        <>
            {isDayGap() || idx == 0 && (
                <div className="custom-divider divider-2">
                    <span className="day-gap-divider bg-white">
                        {`${date.getDate()} tháng ${date.getMonth() + 1} năm ${date.getFullYear()}`}
                    </span>
                </div>
            )}
            <li id={message.id} className="flex hover:bg-[#F7F7F7] relative">
                {isTenMinuteGap() ? (
                    <div className="message mt-0 relative min-h-[1.375rem] py-1 px-[70px]">
                        <div className="static ml-0 pl-0 indent-0 flex flex-col">
                            <span className="message-time absolute left-0 w-[56px] leading-5 h-[1.375rem] user-select-none text-right text-xs mr-1">
                                <time>{formatTimestamp()}</time>
                            </span>
                            {message.content.length > 1 ?
                                <div className="leading-5">
                                    {link
                                        ? <a target="_blank" href={message.content} className="mt-2 cursor-pointer no-underline hover:underline text-[#006CE7]" rel="noreferrer noopener"><span>{message.content}</span></a>
                                        : <span className={`outline-none whitespace-pre-line`}>{message.content}</span>}
                                </div>
                                : null}
                            {link
                                ? <LinkRender link={message.content} type={type} />
                                : null}
                            {message.attachments && message.attachments.length > 0
                                ?
                                    <AttachmentRender attachments={message.attachments} />
                                : null}
                            {message.emojis && message.emojis.length > 0
                                ? 
                                    <Emoji emojis={message.emojis} messageId = {message.id}/>
                                : null}
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 min-h-[2.75rem] py-[1px] px-[70px] align-baseline">
                        <div className="static">
                            {/* <img
                                className="avatar w-[40px] h-[40px] absolute left-[16px] rounded-[50%] bg-[#5865F2] overflow-hidden cursor-pointer select-none"
                                alt=""
                            /> */}
                            <div className="avatar online absolute left-[16px]">
                                <div className="w-[40px] h-[40px] rounded-full">
                                    {message.user?.avatarUrl ? 
                                        <img className="w-full h-full overflow-hidden cursor-pointer select-none" src={message.user.avatarUrl} />
                                    :
                                        <img className="w-full h-full overflow-hidden cursor-pointer select-none" src="https://chatapp-long-1.s3.ap-southeast-1.amazonaws.com/7f15142d4ff388f352cd.webp"/>
                                    }
                                </div>
                            </div>
                            <h3 className="overflow-hidden relative leading-5 text-base mb-0">
                                <span>
                                    <span className="font-bold leading-5 overflow-hidden align-baseline">
                                        {message.user ? message.user.userName
                                        : message.username}
                                    </span>
                                    <span className="text-xs font-medium ml-2 leading-5 align-baseline">
                                        <time>{formatTimestamp()}</time>
                                    </span>
                                </span>
                            </h3>
                            {message.content && message.content.length > 1 ?
                                <div className="indent-0 leading-5">
                                    {link
                                        ? <a target="_blank" href={message.content} className="cursor-pointer no-underline hover:underline"><span className="text-[#006CE7]">{message.content}</span></a>
                                        : <span className={`outline-none whitespace-pre-line`}>{message.content}</span>}
                                </div>
                                : null}
                            {link
                                ? <LinkRender link={message.content} type={type} />
                                : null}
                            {message.attachments && message.attachments.length > 0
                                ?
                                <AttachmentRender attachments={message.attachments} />
                                : null}
                            {message.emojis && message.emojis.length > 0
                                ? 
                                 <div>Emoji</div>
                                : null}
                        </div>
                    </div>
                )}
                {message.id === 66 ? 
                    <AddEmoji messageId={message.id}/>
                : null}
            </li>
        </>
    );
}