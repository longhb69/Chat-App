import { useEffect, useRef } from "react";

export default function MessageContainer({ messages }) {
    const messageRef = useRef();

    useEffect(() => {
        if (messageRef && messageRef.current) {
            const { scrollHeight, clientHeight } = messageRef.current;
            messageRef.current.scrollTo({
                left: 0, top: scrollHeight - clientHeight,
                behavior: "smooth"
            })
        }
    }, [messages])
    return (
        <div ref={messageRef} className="w-full h-full">
            {messages.map((msg, index) => {
                return (
                    <table striped bordered>
                        <tr key={index}>
                            <td>{msg.content} - {msg.username}</td>
                        </tr>
                    </table>
                )
            })}
        </div>
    );
}