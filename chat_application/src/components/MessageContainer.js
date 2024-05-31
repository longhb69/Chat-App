import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import axios from "axios";
import { BaseUrl } from "../shared";
import SendMessageForm from "./SendMessageForm";
import LoadingMessage from "./LoadingMessage";
import { usePage } from "../PageContext";
import { useLogin } from "../LoginContext";


export default function MessageContainer({ messages, chatRoomId, setMessages, sendMessage, conn}) {
    const messageRef = useRef();
    const thresholdRef= useRef(null)
    const [page, setPage] = useState(1)
    const [isEnd, setIsEnd] = useState(false)
    const [disableScroll, setDisableScroll] = useState(false)
    const bottomRef = useRef()
    const [pageInfo, updatePageInfo] = usePage()
    const [authInfo] = useLogin()

    useEffect(() => {
        if (!disableScroll && messageRef && messageRef.current) {
            const lastMessage = messages[messages.length - 1]
            if(lastMessage?.username === authInfo.userName) {
                console.log(authInfo.userName)
                const { scrollHeight, clientHeight } = messageRef.current
                messageRef.current.scrollTo({
                    left: 0, top: scrollHeight - clientHeight,
                    behavior: 'smooth'
                })
            }
        }
        if(messages.length % 30 !== 0) {
            setIsEnd(true)
        }
        if(messages.length > 30) {
            setDisableScroll(true)
            setTimeout(() => {
                setDisableScroll(false)
            }, 1000)
        }
        console.log(messages)
    }, [messages])

    const lazyLoadCallBack = (entries, observer) => {
        entries.forEach((entry) => {
            if(entry.isIntersecting) {
                const nextPage = page + 1
                const currentPage = filterPageInfo(chatRoomId)
                if(currentPage[chatRoomId] !== nextPage) { //check if next page is already loaded
                    getOldMessage(nextPage)
                }
                setPage(nextPage)
                updatePageInfo(chatRoomId, nextPage)
                setDisableScroll(true)
                setTimeout(() => {
                    setDisableScroll(false)
                }, 1000)
            }
            //observer.unobserve(entry.target)
        })
    }

    useEffect(() => {
        let prevScrollHeight = 0
        const intervalId = setInterval(() => {
            if (messageRef && messageRef.current) {
                const currentScrollHeight = messageRef.current.scrollHeight;
                if (currentScrollHeight !== prevScrollHeight) {
                    prevScrollHeight = currentScrollHeight;
                } else {
                    clearInterval(intervalId);
                    messageRef.current.scrollTop = currentScrollHeight;
                }
            }
        }, 100);

        const options = {
            threshold: 1,
        }

        const observer = new IntersectionObserver(lazyLoadCallBack, options)
        const delayTimeout = setTimeout(() => {
            if (thresholdRef.current) {
                observer.observe(thresholdRef.current);
            }
        }, 1000); 
        return () => {
            clearTimeout(delayTimeout);
            observer.disconnect();
        };
    }, []);

    const filterPageInfo = (chatRoomIdToFilter) => {
        const filteredPageInfo = {}
        Object.keys(pageInfo).forEach(chatRoomId => {
            if(String(chatRoomIdToFilter) === chatRoomId) {
                filteredPageInfo[chatRoomId] = pageInfo[chatRoomId]
            }
        })
        return filteredPageInfo
    }

    const getOldMessage = (page) => {
        axios.get(BaseUrl + `api/message_for_chatroom/${chatRoomId}?pageNumber=${page}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            }
        }).then((response) => {
            setMessages(preMessage => [ ...response.data, ...preMessage])
            if(response.data.length < 30) setIsEnd(true)
        })
    }

    const messagesWithPrevious = messages.reduce((acc, message, idx) => {
        var premessage;
        if(idx-1 < 0) {
            premessage = null
        }
        else {
            premessage = messages[idx-1]
        }
        acc.push({ message, premessage })
        return acc
    }, [])

    useEffect(() => {
        bottomRef.current.scrollIntoView({
            behavior: 'smooth'
        })
    }, [])

    return (
        <div className="chat-1">
            <div className="chat-contet">
                <main className="chat-content2 bg-[#fff]">
                    <div className="messages-wrapper">
                        <div ref={messageRef} className="scroller-content absolute top-0 left-0 bottom-0 right-0 scrollerBase overflow-y-scroll">
                            <ol className="min-h-[0px] list-none p-0 text-[#121212] text-base">
                                {messages.length > 1 && !isEnd ? <LoadingMessage /> : null}
                                {!isEnd ? <div ref={thresholdRef} className="h-[20px]"></div> : null } 
                                {messagesWithPrevious.map(({ message, premessage }, idx) => (
                                    <Message key={message.id} message={message} premessage={premessage} idx={idx}/>
                                ))}
                                <div ref={bottomRef}></div>
                                <div className="h-[30px] w-[1px] pointer-events-none"></div>
                            </ol>
                        </div>
                    </div>
                    <SendMessageForm setMessages={setMessages} sendMessage={sendMessage} chatRoomId={chatRoomId} conn={conn}/>
                </main>
            </div>
        </div>
    )
}