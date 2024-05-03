
import ChatRoom from './ChatRoom';
import WaitingRoom from '../components/WaitingRoom';
import Rooms from '../components/Rooms'
import { useEffect, useState } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import axios, {Axios} from 'axios';
import { BaseUrl } from '../shared';
import { useLogin } from '../LoginContext';
import { useNavigate, useParams } from 'react-router-dom';
import AddChatRoomModal from '../components/AddChatRoomModal';
import LayerContainer from '../components/LayerContainer';
import { UseModal } from '../ModalContext';
import { usePage } from '../PageContext';
import UserLayerContainer from '../components/UserLayerContainer';
import SideBar from '../components/SideBar';
import AccountRoom from './AccountRoom';

export default function Home() {
    const [conn, setConnection] = useState();
    const [accountConn, setAccountCon] = useState(false);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [roomName, setRoomName] = useState();
    const [authInfo, setAuthInfo] = useLogin();
    const [currentRoomId, setCurrentRoomId] = useState();
    const { modal, setModal, rednerComponent } = UseModal();
    const [pageInfo, updatePageInfo] = usePage()
    const [userSetting, setUserSetting] = useState(false)

    const { id } = useParams()
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn()) {
            if(isTokenExpired(localStorage.getItem('token'))) {
                navigate("/login")
            }  
            else {
                // const conn = new HubConnectionBuilder()
                // .withUrl("http://localhost:5161/chat", {
                //     accessTokenFactory: async () => localStorage.getItem('token')
                // })
                // .configureLogging(LogLevel.Information)
                // .build();

                // conn.start();
                // setConnection(conn);
                // setAccountCon(true)
                // navigate("/channels/me")
                if(id > 0) {
                    JoinSpecificChatRoom(authInfo.userId, Number(id))
                }
                else if (id=== "me"){
                    GoToAccountChannel()
                }
            }
        }
    }, [id])

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
                const messageId = await conn.invoke("SendMessage", message);
                let uploadResults = [];
                const uploadPromises = files.map(async file => {
                    const formData = new FormData()
                    console.log(file)
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
    const JoinSpecificChatRoom = async (userId, chatroomId) => {
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
            //setRoomName(roomName);
            //navigate("/channels/" + chatroomId )
            setCurrentRoomId(chatroomId);
            GetMessagesForChatRoom(chatroomId)
        } catch (e) {
            console.log(e)
        }
    }
    const GetMessagesForChatRoom = (chatroomId) => {
        const oldPage = filterPageInfo(chatroomId)
        if(oldPage[chatroomId] > 1) {
            fetchMessages(chatroomId, oldPage[chatroomId]) //get prev page 
        }
        else {
            fetchMessages(chatroomId) //get just 30 page
        }
    }

    const fetchMessages = async (chatroomId, page = 1) => {
        setMessages([])
        for(let i = 0;i<page;i++) {
            let response = await axios.get(BaseUrl + `api/message_for_chatroom/${chatroomId}?pageNumber=${i+1}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                }
            })
            if(response.status === 200) {
                setMessages(prevMessage => [...response.data, ...prevMessage])
            }
        }
    }

    const filterPageInfo = (chatRoomIdToFilter) => {
        const filteredPageInfo = {}
        Object.keys(pageInfo).forEach(chatRoomId => {
            if(String(chatRoomIdToFilter) === chatRoomId) {
                filteredPageInfo[chatRoomId] = pageInfo[chatRoomId]
            }
        })
        return filteredPageInfo
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
        navigate("/channels/me")
        setCurrentRoomId(-1)
        closeConnection();
        setAccountCon(true);
    }

    function isTokenExpired(token) {
        if (!token) {
            return true; 
        }

        const tokenPayload = JSON.parse(atob(token.split('.')[1])); // Decode token payload
        const expirationTime = tokenPayload.exp * 1000; // Expiration time in milliseconds

        return Date.now() >= expirationTime; // Check if current time is greater than or equal to expiration time
    }

    return <div className='fullscreen'>
        <div className='layers'>
            <div aria-hidden={false} className={`relative overflow-hidden flex h-full w-full ${userSetting ? 'opacity-0' : ''}`}> {/*this layer can add child that handle user Nav */}
                {<Rooms JoinSpecificChatRoom={JoinSpecificChatRoom} GoToAccountChannel={GoToAccountChannel} currentRoomId={currentRoomId} />}
                {conn
                    ? users.length > 0 && 
                        <>
                            <SideBar triggerUserSetting={setUserSetting}/>
                            <ChatRoom conn={conn} messages={messages} setMessages={setMessages} sendMessage={sendMessage} closeConnection={closeConnection} users={users} roomName={"roomName"} currentRoomId={currentRoomId} triggerUserSetting={setUserSetting}/>
                        </>
                    : null
                }
                {accountConn
                    ? 
                        <>
                            <SideBar triggerUserSetting={setUserSetting} account={true}/>
                            <AccountRoom/>
                        </>
                    : null}

                {/* <div className='w-[100px]'>
                    <h1>{authInfo.userName}</h1>
                    <p>{authInfo.userId}</p>
                    <p>{authInfo.token}</p>
                </div> */}
            </div>
            <UserLayerContainer trigger={userSetting} setTrigger={setUserSetting}/>
        </div>
        <LayerContainer>
            {rednerComponent()}
        </LayerContainer>
    </div>
}