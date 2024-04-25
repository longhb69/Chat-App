import { createContext, useContext, useEffect, useRef, useState } from "react";
import { BaseUrl } from "./shared";
import Lottie from "lottie-react";
import * as animationData from "./animation/loading-cricle-animation.json";

const ModalContext = createContext()

export function UseModal() {
    return useContext(ModalContext)
}

export function ModalProvider({ children }) {
    const [modal, setModal] = useState({});
    const [initialItem, setInitialItem] = useState(0);
    const [carouselSecondItem, setCarouselSecondItem] = useState(false);
    const nextBtnRef = useRef()
    const prevBtnRef = useRef()

    const rednerComponent = () => {
        const handlePrev = (e) => {
            e.stopPropagation();
            var preItem = initialItem - 1;
            if (preItem < 0) preItem = preItem % modal.modals.length + modal.modals.length;
            setInitialItem(preItem)
            setCarouselSecondItem(true)
            if (prevBtnRef && prevBtnRef.current) {
                const button = prevBtnRef.current
                button.classList.add('click')
                button.addEventListener('animationed', () => {
                    button.classList.remove('click')
                }, { once: true })
            }
        }
        const handleNext = (e) => {
            e.stopPropagation();
            setInitialItem(prevItem => ((prevItem + 1) % modal.modals.length))
            if (nextBtnRef && nextBtnRef.current) {
                const button = nextBtnRef.current
                button.classList.add('click')
                button.addEventListener('animationend', () => {
                    button.classList.remove('click');
                }, { once: true })
            }
        }
        return (
            <>
                {modal.modals && modal.modals.length >= 1 ?
                    <>
                        <div className="backdrop" style={{ backgroundColor: 'rgba(0,0,0,0.64)', backdropFilter: 'blur(0px)' }}></div>
                        <div className="layer_ad">
                            <div className="flex flex-col min-h-[0px] max-w-[100%]" aria-modal="true" role="dialog">
                                {modal.modals.length === 1 ?
                                    <>
                                        <div className="modal_image" style={{ opacity: '1' }}>
                                            <div className="relative">
                                                {modal.modals.map((item) => {
                                                    switch (item.type) {
                                                        case '.jpg':
                                                        case "jpg":
                                                        case ".webp":
                                                        case ".png":
                                                            return <ImageModal image={item} />
                                                        default:
                                                            return null
                                                    }
                                                })}
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="modal_image carouselModal">
                                            <div className="absolute top-[60px] bottom-[60px] left-[110px] right-[110px] flex justify-center cursor-zoom-out modalCarouselWrapper">
                                                <button ref={prevBtnRef} className="prev-btn ml-[-100px] text-[#CC8899] left-[4px] arrowContainer m-0 p-0 opacity-[.6] hover:opacity-[1]" onClick={(e) => handlePrev(e)}>
                                                    <div>
                                                        <svg class="w-[26px] h-[26px] pointer-events-all left" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12.7 3.3a1 1 0 0 0-1.4 0l-5 5a1 1 0 0 0 1.4 1.4L11 6.42V20a1 1 0 1 0 2 0V6.41l3.3 3.3a1 1 0 0 0 1.4-1.42l-5-5Z" class=""></path></svg>
                                                    </div>
                                                </button>
                                                <div className="relative">
                                                    {(() => {
                                                        switch (modal.modals[initialItem].type) {
                                                            case '.jpg':
                                                            case "jpg":
                                                            case ".webp":
                                                            case ".png":
                                                                return <ImageModal image={modal.modals[initialItem]} carousel={true} />
                                                            case ".mp4":
                                                            case ".webm":
                                                                return <VideoModal video={modal.modals[initialItem]}/>
                                                            default:
                                                                return null
                                                        }
                                                    })()}
                                                </div>
                                                <button ref={nextBtnRef} className="next-btn mr-[-100px] text-[#CC8899] right-[4px] arrowContainer m-0 p-0 opacity-[.6] hover:opacity-[1]" onClick={(e) => handleNext(e)}>
                                                    <div>
                                                        <svg class="w-[26px] h-[26px] pointer-events-all right" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12.7 3.3a1 1 0 0 0-1.4 0l-5 5a1 1 0 0 0 1.4 1.4L11 6.42V20a1 1 0 1 0 2 0V6.41l3.3 3.3a1 1 0 0 0 1.4-1.42l-5-5Z" class=""></path></svg>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                    </>
                    : null
                }
            </>
        )

    }
    const ImageModal = ({ image, carousel = false }) => {
        let firstClick = carouselSecondItem ? false : true
        const [url, setUrl] = useState('')
        const [isLoaded, setIsLoaded] = useState(false);
        const [width, setWidth] = useState(0);
        const [height, setHeight] = useState(0);
        const loadingRef = useRef();

        const handleLoading = () => {
            setIsLoaded(true)
        }

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (firstClick) {
                    console.log('first click')
                    firstClick = false
                    return
                }
                if (!carousel) {
                    const firstLayerAdElement = document.getElementsByClassName('layer_ad')[0];
                    if (!firstLayerAdElement.contains(event.target)) setModal('')
                }
                else {
                    setModal('')
                }
            };
            document.body.addEventListener('click', handleClickOutside);
            var newWidth;
            var newHeight;
            if (image.width) {
                var resizeWidth = 0;
                if (image.width <= 800) {
                    resizeWidth = image.width
                } else if (image.width <= 1280) {
                    resizeWidth = Math.floor(image.width / 1.46)
                } else  if(image.width > 1280) {
                    resizeWidth = 1100
                } else {
                    resizeWidth = Math.floor(image.width / 2.2)
                }
                const divisor = image.width / resizeWidth;
                const resizeHeight = parseInt(Math.round(image.height / divisor));
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
            setUrl(BaseUrl + `api/FileUpload/attachment/download?fileName=${image.contentName}&width=${newWidth}&height=${newHeight}`)
            setTimeout(function () {
                if (loadingRef.current) loadingRef.current.classList.add('loading-image')
            }, 3000)
            return () => {
                setCarouselSecondItem(false)
                document.body.removeEventListener('click', handleClickOutside);
            };
        }, [])
        return (
            <>
                <div className="overflow-hidden relative block select-text" style={{ width: `${width}px`, height: `${height}px` }}>
                    <div className="w-full h-full">
                        <img src={url} onLoad={handleLoading} />
                        {!isLoaded ?
                            <div ref={loadingRef} className={`bg-[#121212] opacity-[.2] w-full h-full relative`}>
                                <Lottie className="lottie absolute top-0 right-0 bottom-0 -left-[1] w-[50px] h-[50px]" animationData={animationData} loop={true} />
                            </div>
                            : null}
                    </div>
                </div>
                <a href={image.contentUrl} target="_blank" className="absolute top-[100%] cursor-pointer text-[#fff] text-sm no-underline font-medium leading-7 opacity-[.5] transition-opacity hover:opacity-[1] hover:underline">Mở trong trình duyệt</a>
            </>
        )
    }

    const VideoModal = ({video}) => {
        let firstClick = false
        const [width, setWidth] = useState(0);
        const [height, setHeight] = useState(0);

        const handleClickOutside = (event) => {
            setModal('')
        }

        useEffect(() => {
            setTimeout(function () {
                document.body.addEventListener('click', handleClickOutside);
            }, 500)
            var newWidth;
            var newHeight;
            if (video.width) {
                var resizeWidth = 0;
                if (video.width <= 800) {
                    resizeWidth = video.width
                } else if (video.width <= 1280) {
                    resizeWidth = Math.floor(video.width / 1.46)
                } else  if(video.width > 1280) {
                    resizeWidth = 1100
                } else {
                    resizeWidth = Math.floor(video.width / 2.2)
                }
                const divisor = video.width / resizeWidth;
                const resizeHeight = parseInt(Math.round(video.height / divisor));
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
            return () => {
                document.body.removeEventListener('click', handleClickOutside);
            }
        }, [])
        return (
            <>
                <div className="overflow-hidden relative block select-text" style={{ width: `${width}px`, height: `${height}px` }}>
                    <div className="w-full h-full">
                        <video className="w-full h-full block relative object-contain rounded-[3px] overflow-clip" src={video.contentUrl} controls autoPlay/>
                    </div>
                </div>
                <a href={video.contentUrl} target="_blank" className="absolute top-[100%] cursor-pointer text-[#fff] text-sm no-underline font-medium leading-7 opacity-[.5] transition-opacity hover:opacity-[1] hover:underline">Mở trong trình duyệt</a>
            </>
        )
    }

    useEffect(() => {
        rednerComponent()
    }, [modal])

    return (
        <ModalContext.Provider value={{ setModal, rednerComponent, setInitialItem }}>
            {children}
        </ModalContext.Provider>
    );
}