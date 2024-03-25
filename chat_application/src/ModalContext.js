import { createContext, useContext, useEffect, useState } from "react";
import { BaseUrl } from "./shared";

const ModalContext = createContext()

export function UseModal() {
    return useContext(ModalContext)
}

export function ModalProvider({ children }) {
    const [modal, setModal] = useState({ type: "", contentName: "", contentUrl: "", width: 900, height: 400 });

    const rednerComponent = () => {
        switch (modal.type) {
            case 'image':
                return <ImageModal />
            default:
                return <ImageModal />
        }
    }
    const ImageModal = () => {
        let firstClick = true
        const [url, setUrl] = useState('')
        const [isLoaded, setIsLoaded] = useState(false);
        const [width, setWidth] = useState(0);
        const [height, setHeight] = useState(0);

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (firstClick) {
                    firstClick = false;
                    return
                }
                const firstLayerAdElement = document.getElementsByClassName('layer_ad')[0];
                if (!firstLayerAdElement.contains(event.target)) {
                    console.log("click outside");
                    setModal('')
                }
            };
            window.addEventListener('click', handleClickOutside);
            var newWidth;
            var newHeight;
            if (modal.width) {
                const resizeWidth = Math.floor(modal.width / 2.2)
                const divisor = modal.width / resizeWidth;
                const resizeHeight = parseInt(Math.round(modal.height / divisor));
                console.log(resizeHeight, divisor)
                newWidth = resizeWidth
                setWidth(resizeWidth)
                newHeight = resizeHeight;
                setHeight(resizeHeight)
            }
            else {
                setWidth(newWidth = 1000)
                newHeight = 500;
                setHeight(500)
            }
            setUrl(BaseUrl + `api/FileUpload/attachment/dowload?fileName=${modal.contentName}&width=${newWidth}&height=${newHeight}`)
            return () => {
                window.removeEventListener('click', handleClickOutside);
            };

        }, [])

        const handleLoading = () => {
            setIsLoaded(true)
        }

        return (
            <>
                <div className="backdrop" style={{ backgroundColor: 'rgba(0,0,0,0.64)', backdropFilter: 'blur(0px)' }}></div>
                <div className="layer_ad">
                    <div className="flex flex-col min-h-[0px] max-w-[100%]" aria-modal="true" role="dialog">
                        <div className="modal_image" style={{ opacity: '1' }}>
                            <div className="relative">
                                <div className="overflow-hidden relative block select-text" style={{ width: `${width}px`, height: `${height}px` }}>
                                    <div className="w-full h-full">
                                        {/* <img src={url} onLoad={handleLoading} /> */}
                                        {!isLoaded ?
                                            <div className={`bg-[#121212] opacity-[.2] w-full h-full`}>

                                            </div>
                                            : null}
                                    </div>
                                </div>
                                <a href={modal.contentUrl} target="_blank" className="absolute top-[100%] cursor-pointer text-[#fff] text-sm no-underline font-medium leading-7 opacity-[.5] transition-opacity hover:opacity-[1] hover:underline">Mở trong trình duyệt</a>
                            </div>
                        </div>
                    </div>
                </div >
            </>
        )
    }

    useEffect(() => {
        rednerComponent()
    }, [modal])

    return (
        <ModalContext.Provider value={{ setModal, rednerComponent }}>
            {children}
        </ModalContext.Provider>
    );
}