import { useEffect, useLayoutEffect, useRef } from "react";
import Message from "./Message";
import SendMessageForm from "./SendMessageForm";


export default function MessageContainer({ messages, chatRoomId, setMessages, sendMessage, conn}) {
    const messageRef = useRef();

    // useEffect(() => {
    //     if (messageRef && messageRef.current) {
    //         const { scrollHeight, clientHeight } = messageRef.current
    //         console.log(messageRef.current)
    //         messageRef.current.scrollTo({
    //             left: 0, top: scrollHeight - clientHeight,
    //             behavior: 'smooth'
    //         })
    //     }
    // }, [messages])

    useEffect(() => {
        let prevScrollHeight = 0;
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

    }, []);

    useEffect(() => {
        console.log("message change")
        console.log(messages)
    }, [messages])

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

    return (
        <div className="chat-1">
            <div className="chat-contet">
                <main className="chat-content2 bg-[#fff]">
                    <div className="messages-wrapper">
                        <div ref={messageRef} className="scroller-content absolute top-0 left-0 bottom-0 right-0 scrollerBase overflow-y-scroll">
                            <ol className="min-h-[0px] list-none p-0 text-[#121212] text-base">
                                {messagesWithPrevious.map(({ message, premessage }, idx) => (
                                    <Message key={message.id} message={message} premessage={premessage} />
                                ))}
                                <div className="h-[30px] w-[1px] pointer-events-none"></div>
                            </ol>
                        </div>
                    </div>
                    <div>
                        <video src={"https://chatapp-long-1.s3.ap-southeast-1.amazonaws.com/God+of+War+Ragnar%C3%B6k_+Valhalla+-+Reveal+Trailer+_+PS5+%26+PS4+Games+(1).mp4"}
                                controls 
                        >
                               
                        </video>
                    </div>
                    <SendMessageForm setMessages={setMessages} sendMessage={sendMessage} chatRoomId={chatRoomId} conn={conn}/>
                </main>
            </div>
        </div>
    )
}