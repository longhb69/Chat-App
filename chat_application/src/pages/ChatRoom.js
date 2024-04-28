import React, { useRef } from "react";
import { Button } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import { BaseUrl } from "../shared";
import axios from "axios";
import { useLogin } from "../LoginContext";
import MessageContainer from "../components/MessageContainer";
import SideBar from "../components/SideBar";


export default function ChatRoom({ conn, messages, setMessages, sendMessage, closeConnection, users, roomName, currentRoomId, triggerUserSetting }) {
    const [show, setShow] = useState(false);
    const [query, setQuery] = useState('');
    const [result, setResult] = useState();
    const [authInfo, setAuthInfo] = useLogin();

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
    return (
        <div className="flex flex-col overflow-hidden relative grow">
            <div className="content">
                {/* <SideBar triggerUserSetting={triggerUserSetting}/> */}
                <MessageContainer messages={messages} chatRoomId={currentRoomId} setMessages={setMessages} sendMessage={sendMessage} conn={conn}/>
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