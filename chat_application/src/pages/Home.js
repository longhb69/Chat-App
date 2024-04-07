
import ChatRoom from '../components/ChatRoom';
import WaitingRoom from '../components/WaitingRoom';
import Rooms from '../components/Rooms'
import { useEffect, useState } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import axios from 'axios';
import { BaseUrl } from '../shared';
import { useLogin } from '../LoginContext';
import { useNavigate } from 'react-router-dom';
import AddChatRoomModal from '../components/AddChatRoomModal';
import { Button } from 'react-bootstrap';
import LayerContainer from '../components/LayerContainer';
import { UseModal } from '../ModalContext';
export default function Home() {
    const [conn, setConnection] = useState();
    const [accountConn, setAccountCon] = useState(false);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [roomName, setRoomName] = useState();
    const [authInfo, setAuthInfo] = useLogin();
    const [currentRoomId, setCurrentRoomId] = useState();
    const timezoneOffset = new Date().getTimezoneOffset()
    const { modal, setModal, rednerComponent } = UseModal();

    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn()) {
            const conn = new HubConnectionBuilder()
                .withUrl("http://localhost:5161/chat", {
                    accessTokenFactory: async () => localStorage.getItem('token')
                })
                .configureLogging(LogLevel.Information)
                .build();
            conn.start();

            setConnection(conn);
        }
    }, [])

    const closeConnection = async () => {
        try {
            await conn.stop();
        } catch (e) {
            console.log(e);
        }
    }

    const sendMessage = async (message, files = []) => {
        try {
            if (files.length > 0) {
                const attachment = true
                const messageId = await conn.invoke("SendMessage", message, attachment);
                let uploadResults = [];
                const uploadPromises = files.map(async file => {
                    const formData = new FormData()
                    formData.append('file', file);
                    const url = BaseUrl + `api/FileUpLoad/attachment/upload/${messageId}`
                    return await axios.post(url, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                })
                uploadResults = await Promise.allSettled(uploadPromises, messageId)
                return {messageId, uploadResults}
            }
            else {
                await conn.invoke("SendMessage", message);
                return { success: true, message: "Message sent successfully" };
            }
        } catch (e) {
            console.log(e);
            return { success: false, error: e.message }
        }
    }
    const JoinSpecificChatRoom = async (userId, chatroomId, roomName) => {
        try {
            closeConnection();
            setAccountCon(false)
            const conn = new HubConnectionBuilder()
                .withUrl("http://localhost:5161/chat", { accessTokenFactory: () => localStorage.getItem('token') })
                .configureLogging(LogLevel.Information)
                .build();

            conn.on("UsersInRoom", (users) => {
                setUsers(users);
            })

            conn.on("ReceiveMessage", (id, username, content, timestamp) => {
                const newmsg = true
                setMessages(messages => [...messages, { id,username, content, timestamp, newmsg }]);
            });

            conn.on("ReceiveAttachment", (messageId) => {
                axios.get(BaseUrl + `api/message/${messageId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    }
                }).then((response) => {
                    setMessages(prevMessages => {
                        return prevMessages.map(message => {
                            if(message.id === messageId) {
                                console.log(response.data)
                                return {...message, attachments: response.data.attachments}
                            }
                            return message
                        })
                    })
                })
            })

            conn.onclose(e => {
                setConnection();
                setMessages([]);
                setUsers([]);
            })

            await conn.start();
            await conn.invoke("JoinRoom", { userId, chatroomId });
            setConnection(conn)
            setRoomName(roomName);
            setCurrentRoomId(chatroomId);
            axios.get(BaseUrl + `api/message_for_chatroom/${chatroomId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                }
            }).then((response) => {
                setMessages(response.data)
            })
        } catch (e) {
            console.log(e)
        }
    }
    const isLoggedIn = () => {
        return localStorage.getItem('token') !== null;
    };
    useEffect(() => {
        if (!isLoggedIn()) {
            navigate('/login');
        }
    }, [])
    const GoToAccountChannel = () => {
        //closeConnection();
        setAccountCon(true);

    }
    return <div className='fullscreen'>
        <div className='layers'>
            <div className='relative overflow-hidden flex h-full w-full'>
                {<Rooms JoinSpecificChatRoom={JoinSpecificChatRoom} GoToAccountChannel={GoToAccountChannel} currentRoomId={currentRoomId} />}
                {conn
                    ? users.length > 0 && <ChatRoom conn={conn} messages={messages} setMessages={setMessages} sendMessage={sendMessage} closeConnection={closeConnection} users={users} roomName={roomName} currentRoomId={currentRoomId} />
                    : null
                }
                {accountConn
                    ? <div>Account</div>
                    : null}

                {/* <div className='w-[100px]'>
                    <h1>{authInfo.userName}</h1>
                    <p>{authInfo.userId}</p>
                    <p>{authInfo.token}</p>
                </div> */}
            </div>
        </div>
        <LayerContainer>
            {rednerComponent()}
        </LayerContainer>
    </div>
}