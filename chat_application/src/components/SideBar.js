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

    return (
        <div className="sidebar bg-[#F2F3F5] z-[1]">
            {getSideBarComponent()}
        </div>
    )
}