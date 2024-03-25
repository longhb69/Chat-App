import { useEffect, useState } from "react"
import { BaseUrl } from "../shared"
import axios from "axios";

export default function ConnectedUsers({ users }) {
    const [currentUsers, setCurrentUsers] = useState(new Set());
    //const [fetchedUserIds, setFetchedUserIds] = useState(new Set());

    useEffect(() => {
        const fetchUsers = async () => {
            setCurrentUsers([]);
            users.forEach(userId => {
                GetUserInfo(userId);
            });
        }
        fetchUsers();
    }, [users])

    const GetUserInfo = async (userId) => {
        try {
            const url = BaseUrl + `api/user/${userId}`;
            const headers = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                }
            }
            axios.get(url, headers).then((response) => {
                setCurrentUsers(prevUsers => [...prevUsers, response.data]);
            })
        } catch (error) {
            console.error('Error fetching user information:', error);
        }
    }
    return <div>
        <h4>Connected Users</h4>
        {Array.from(currentUsers).map((user, idx) => (
            <div key={idx}>
                <h6>{user.userName}</h6>
                <p>Email: {user.email}</p>
                <p>Phone Number: {user.phoneNumber}</p>
            </div>
        ))}
    </div>
} 