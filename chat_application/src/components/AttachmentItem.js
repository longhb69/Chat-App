import { useEffect, useState } from "react"

export default function AttachmentItem({ file, deleteFile }) {
    const [imageUrl, setImageUrl] = useState('');
    useEffect(() => {
        const reader = new FileReader()
        reader.onload = (event) => {
            setImageUrl(event.target.result)
        }
        reader.readAsDataURL(file)

        return () => {
            reader.abort()
        }
    }, [file])
    return (
        <li className="inline-flex flex-col bg-[#F2F3F5] rounded m-0 p-[8px] relative min-w-[200px] max-w-[216px] min-h-[200px] max-w-[216px]">
            <div className="flex relative flex-col h-full relative">
                <div className="mt-auto relative min-h-0">
                    <div className="h-full cursor-pointer">
                        <div className="h-full relative rounded bg-primary-content">
                            <div className="w-full h-full">
                                <div className="flex justify-center h-full">
                                    <img className="rounded-[3px] max-w-[100%] max-h-[200px] object-contain" src={imageUrl} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-auto">
                    <div className="mt-[8px] overflow-hidden text-ellipsis whitespace-nowrap text-sm font-normal leading-3">
                        {file.name}
                    </div>
                </div>
                <div className="absolute top-0 right-0">
                    <div className="absolute right-0 z-1 p-0 action-bar">
                        <div className="tooltip-wrapper text-[#e12] hover:bg-neutral-content" onClick={deleteFile}>
                            <div className="flex items-center justify-center h-[24px] p-[4px] min-w-[24px] cursor-pointer relative">
                                <svg class="w-[24px] h-[20px] block object-contain overflow-hidden" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M14.25 1c.41 0 .75.34.75.75V3h5.25c.41 0 .75.34.75.75v.5c0 .41-.34.75-.75.75H3.75A.75.75 0 0 1 3 4.25v-.5c0-.41.34-.75.75-.75H9V1.75c0-.41.34-.75.75-.75h4.5Z" class=""></path><path fill="currentColor" fill-rule="evenodd" d="M5.06 7a1 1 0 0 0-1 1.06l.76 12.13a3 3 0 0 0 3 2.81h8.36a3 3 0 0 0 3-2.81l.75-12.13a1 1 0 0 0-1-1.06H5.07ZM11 12a1 1 0 1 0-2 0v6a1 1 0 1 0 2 0v-6Zm3-1a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Z" clip-rule="evenodd" class=""></path></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    )
}