import { useEffect, useRef } from "react"

export default function UserLayerContainer({trigger, setTrigger}) {
    const layerRef = useRef()
    useEffect(() => {
        const element = layerRef.current;
        if(element) {
            
        }
    }, [])
    return ( trigger ? (
        <>
            <div ref={layerRef} className="absolute top-0 right-0 bottom-0 left-0 flex flex-col overflow-hidden bg-[#FFFFFF]">
                <div className="absolute top-0 right-0 bottom-0 left-0 z-[101] flex bg-[#FFFFFF]" style={{opacity: '1'}}>
                    <div className="flex z-1 justify-end sidebarRegion">
                        <nav className="w-[218px] py-[60px] pl-[20px] pr-[10px] bg-[#F2F3F5]">
                            <div className="flex flex-col text-base font-medium">
                                <div className="pb-[6px] px-[10px] whitespace-nowrap overflow-ellipsis overflow-hidden shrink-0 text-[#655E66]">
                                    <div className="text-xs font-semibold uppercase tracking-wide">Cài đặt người dùng</div>
                                </div>
                                <div className="py-[6px] px-[10px] mb-[2px] rounded bg-[#E0E1E5]">
                                    Tài Khoản Của Tôi
                                </div>
                            </div>
                        </nav>
                    </div>
                    <div>
                        <div className="">
                            <div className="flex flex-col items-center">
                                <div className="closeButton text-[#33353A]" onClick={() => setTrigger(false)}>
                                    <svg aria-hidden="true" role="img" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
    : null
    )
}