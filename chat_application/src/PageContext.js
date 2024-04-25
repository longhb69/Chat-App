import { createContext, useContext, useEffect, useState } from "react";

const PageContext = createContext()

export function usePage() {
    return useContext(PageContext)
}

export function PageProvider({children}) {
    const [pageInfo, setPageInfo] = useState({})

    const updatePageInfo = (chatRoomId, page) => {
        setPageInfo(prevPageInfo => ({ ...prevPageInfo, [chatRoomId]: page }))
    }

    const updatePageHeight = (chatRoomId, height) => {
        setPageInfo(prevPageInfo => ({
            ...prevPageInfo,
            [chatRoomId]: {
                ...prevPageInfo[chatRoomId],
                height: height
            }
        }));
    };
    return (
        <PageContext.Provider value={[pageInfo, updatePageInfo]}>
            {children}
        </PageContext.Provider>
    )
}