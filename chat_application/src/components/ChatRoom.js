import React from "react";
import SendMessageForm from "./SendMessageForm";
import { Button } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import { BaseUrl } from "../shared";
import axios from "axios";
import { useLogin } from "../LoginContext";
import Message from "./Message";


export default function ChatRoom({ conn, messages, sendMessage, closeConnection, users, roomName, currentRoomId }) {
    const [show, setShow] = useState(false);
    const [query, setQuery] = useState('');
    const [result, setResult] = useState();
    const [authInfo, setAuthInfo] = useLogin();
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const timezoneOffset = new Date().getTimezoneOffset()

    const handleInputChange = debounce((event) => {
        setQuery(event.target.value);
    });
    function debounce(cb, delay = 1000) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                cb(...args)
            }, delay)
        }
    }
    useEffect(() => {
        if (query.trim() !== "") {
            fetchData();
        }
    }, [query])
    const fetchData = async () => {
        const url = BaseUrl + `api/user_by_name/${query}`;
        try {
            const respone = await axios.get(url)
            const data = await respone.data;
            setResult(data)
        } catch (e) {
            console.log(e)
        }
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const AddFriendToChat = async (userId, chatRoomId) => {
        const url = BaseUrl + `api/userchatroom/${userId}/${chatRoomId}/${authInfo.userId}`;
        axios.post(url, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            }
        }).then((response) => {
            if (response.status === 201) { //If user is already in chat room the status will be 200
                conn.invoke("OnUserAddedToRoom", { userId, chatRoomId });
                //conn.invoke("SendConnectedUsers", (chatRoomId));
            }
        });
    }
    const messagesWithPrevious = messages.reduce((acc, message, idx) => {
        const premessage = messages[(idx - 1 + messages.length) % messages.length]
        acc.push({ message, premessage })
        return acc
    }, [])

    return (
        <div className="flex flex-col overflow-hidden relative grow">
            <div className="content">
                <div className="sidebar bg-[#F2F3F5] z-[1]">
                    <div>
                        <div>
                            <Button variant="info" onClick={handleShow}>Add Friends</Button>
                        </div>
                    </div>
                </div>
                <div className="chat">
                    <div className="chat-contet">
                        <main className="chat-content2 bg-[#fff]">
                            <div className="messages-wrapper">
                                <div className="scroller-content absolute top-0 left-0 bottom-0 right-0 scrollerBase overflow-y-scroll">
                                    <ol className="min-h-[0px] list-none p-0">
                                        {messagesWithPrevious.map(({ message, premessage }, idx) => (
                                            <Message key={message.id} message={message} premessage={premessage} />
                                        ))}
                                        <div className="h-[30px] w-[1px] pointer-events-none"></div>
                                    </ol>
                                </div>
                            </div>
                            <SendMessageForm sendMessage={sendMessage} />
                        </main>
                    </div>
                </div>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Mời bạn bè vào {roomName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <div className="">
                            <label htmlFor="friendName">Friend's Name:</label>
                            <input type="text" className="form-control" id="friendName"
                                name="query"
                                onChange={(event) => { handleInputChange(event) }} />
                        </div>

                        <div>
                            <ul>
                                {result && result.length > 0 ?
                                    <>
                                        {result.map((user, index) => {
                                            return (
                                                <li>
                                                    <div>{user.userName}</div>
                                                    <Button onClick={() => { AddFriendToChat(user.id, currentRoomId) }}>Add</Button>
                                                </li>
                                            )
                                        })}
                                    </>
                                    : null}
                            </ul>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleClose}>
                            Thêm
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div >
        </div >
    );
}