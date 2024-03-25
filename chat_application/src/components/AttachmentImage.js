import { UseModal } from "../ModalContext";

export default function AttachmentImage(props) {
    const { setModal } = UseModal();
    const handleImageFocus = () => {
        const modal = {
            type: 'image',
            contentName: props.attachmnet.name,
            contentUrl: props.attachmnet.url,
            width: props.attachmnet.width,
            height: props.attachmnet.height,
        }
        setModal(modal)
    }
    return (
        <div className="overflow-hidden relative rounded-sm w-full items-center messageAttachemnt" onClick={() => handleImageFocus()}>
            <div className="imageContent_2">
                <div className="imageContent">
                    <div className="imageWrapper">
                        <div className="w-full h-full">
                            <div className="aspect-[3.08988/1] w-full h-full">
                                <img src={props.getThumnail(props.attachmnet.name, props.width, props.height)} className="object-cover block min-h-[100%] min-w-[100%] max-w-[calc(100%+1px)] " />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}