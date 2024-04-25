import { useContext, useState, createContext, useEffect } from "react";

const LoginContext = createContext();
const AccountContext = createContext();

export function useLogin() {
    return useContext(LoginContext);
}
export function useAccount() {
    return useContext(AccountContext);
}

export function LoginProvider({ children }) {
    const [authInfo, setAuthInfo] = useState({
        loggedIn: localStorage.token ? true : false,
        userId: localStorage.userId || null,
        userName: localStorage.userName || null
    })
    useEffect(() => {

    }, [])
    return (
        <LoginContext.Provider value={[authInfo, setAuthInfo]}>
            {children}
        </ LoginContext.Provider>
    );
}