import { useEffect } from "react";
import { useRef } from "react";

export default function AttachmentImage(props) {
    const blurRef = useRef(null)
    useEffect(() => {
        const img = blurRef.current.querySelector("img")
        function loaded() {
            if(blurRef.current) 
                blurRef.current.classList.add("loaded")
        }
        if(img.complete) {
            console.log("completed")
            loaded()
        } else {
            img.addEventListener("load", loaded)
        }
    }, [])
    return (
        <div className="overflow-hidden relative rounded-sm w-full items-center messageAttachemnt" onClick={props.onClick}>
            <div className="imageContent_2">
                <div className="imageContent">
                    <div className="imageWrapper" style={{ width: `${props.width}px` }}>
                        <div className="w-full h-full">
                            <div ref={blurRef} className={`aspect-[${props.width/props.height}/1] w-full h-full blur-load`} style={{backgroundImage: `url(${props.getThumnail(props.attachmnet.name, 10, 0)})`}}>
                                <img src={props.getThumnail(props.attachmnet.name, props.width, props.height)} className="object-cover block min-h-[100%] min-w-[100%] max-w-[calc(100%+1px)] " /> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}