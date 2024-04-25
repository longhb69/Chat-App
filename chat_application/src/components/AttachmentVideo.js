import { useRef } from "react"
import VideoJS from "./VideoJS";

export default function AttachmentVideo({attachment, getThumbnail, width, height, onClick, carousel}) {

    const videoRef = useRef(null)
    const playBtnRef = useRef(null)

    const togglePlay = () => {
        videoRef.current.play()
        videoRef.current.controls = true
        playBtnRef.current.classList.add('hidden')
    }
    
    return (
        <div className="overflow-hidden relative rounded-sm w-full items-center messageAttachemnt" onClick={carousel ? onClick : null}>
            <div className="imageContent_2">
                <div className="imageContent">
                    <div className="imageWrapper" style={{ width: `${width}px` }}>
                        <div className={`aspect-[${width/height}/1] w-full h-full`}>
                            <div className="w-full h-full max-h-[inherit] relative overflow-hidden rounded-[3px] text-[#fff] select-none">
                                <video ref={videoRef} className={`w-full h-full max-h-[inherit] object-cover relative block rounded-[3px] overflow-clip select-none`}
                                    //poster={getThumbnail(attachment.name, 550, 0)}
                                    src={attachment.url}
                                    />
                                {/*<VideoJS options={videoJsOptions}/>  */}
                                <div ref={playBtnRef} className="cursor-pointer pointer-events-auto absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
                                    <div className="p-[12px] rounded-[24px] bg-[#333333] text-[#fff] opacity-[.6] transition-opacity hover:opacity-[.9]" onClick={() => carousel ? null : togglePlay()}>
                                        <svg class="w-[24px] h-[24px] block" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M9.25 3.35C7.87 2.45 6 3.38 6 4.96v14.08c0 1.58 1.87 2.5 3.25 1.61l10.85-7.04a1.9 1.9 0 0 0 0-3.22L9.25 3.35Z" class=""></path></svg>
                                    </div>   
                                </div>
                                <div className="absolute top-[50%] left-[50%] ml-[-23px] mt-[-23px] p-[12px] w-[24px] h-[24px] bg-[#1212] text-[#fff]">          
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}