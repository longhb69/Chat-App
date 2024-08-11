import { useTheme } from "../context/ColorContext"
import AccountSideBarMeta from "./AccountSideBarMeta"
import RoomSideBarMeta from "./RoomSideBarMeta"

export default function SideBar({triggerUserSetting, account}) {
    const getSideBarComponent = () => {
        if(account === true) {
            return <>
                <AccountSideBarMeta triggerUserSetting={triggerUserSetting}/>
            </>
        }
        else {
            return <>
                <RoomSideBarMeta triggerUserSetting={triggerUserSetting}/>
            </>
        }
    }

    const {getSideBarTheme} = useTheme()
    
    //#F2F3F5
    return (
        <div className={`sidebar ${getSideBarTheme()} z-[1]`}>
            {getSideBarComponent()}
        </div>
    )
}