import { useEffect, useState } from "react";
import { BaseUrl } from "../shared";
import AttachmentImage from "./AttachmentImage";
import { UseModal } from "../ModalContext";
import AttachmentVideo from "./AttachmentVideo";

export default function AttachmentRender({ attachments }) {
    const [grid, setGrid] = useState('');
    const [grid_2, setGrid_2] = useState('');
    const [secondGrid, setSecondGrid] = useState(false);
    const [firstGridItem, setFirstGridItem] = useState('');
    const [secondGridItem, setSecondGridItem] = useState('');
    const oneByOneGrid = "oneByOneGrid";
    const thereByThereGird = "threeByThreeGrid";
    const twoByTwoGrid = "twoByTwoGrid";
    const oneByTwoGrid = "oneByTwoGrid oneByTwoLayout";
    const oneByTwoGrid_2 = "oneByTwoGrid max-h-[280px]";
    const oneByTwoGridItem = "oneByTwoGridItem";


    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [secondWidth, setSecondWidth] = useState(0);
    const [secondHeight, setSecondHeight] = useState(0);

    const [secondRow, setSecondRow] = useState(false);
    const [itemStart, setItemStart] = useState(attachments.length)
    const [secondRowItems, setSecondRowItems] = useState(0);
    const [thirdItemStart, setThirdItemStart] = useState(0);
    const { setModal, setInitialItem } = UseModal();

    useEffect(() => {
        var attachLength = attachments.length
        if (attachLength === 1) {
            setGrid(oneByOneGrid)
            const attach = attachments[0]
            //1000x1200 set height to 350 and find width which keep aspect ratio
            if(attach.height >= attach.width) {
                const ratio = attach.width/attach.height
                const new_width = parseInt(Math.round(350 * ratio))
                setWidth(new_width)
                setHeight(350)
            }
            else if(attach.width > 550) {
                const divisor = attach.width / 550
                const resizeHeight = parseInt(Math.round(attach.height / divisor))
                if (resizeHeight > 350) {
                    setWidth(Math.floor(attach.width / 2.22))
                } else {
                    setWidth(550)
                }
            }
            else {
                setWidth(550)
            }
        }
        else if (attachLength === 2) {
            setGrid(oneByTwoGrid)
            setSecondRow(true)
            setFirstGridItem(oneByTwoGridItem)
            setSecondGridItem(oneByTwoGridItem)
            setSecondRowItems(1)
            setWidth(273)
            setHeight(273)
        }
        else if (attachLength === 3) {
            setGrid(thereByThereGird)
            setWidth(181)
            setHeight(250)
        }
        else if (attachLength === 4) {
            setGrid(twoByTwoGrid)
            setWidth(273)
        }
        else if (attachLength >= 5 && attachLength % 3 === 0) {
            setGrid(thereByThereGird)
            setWidth(181)
            setHeight(181)
        }
        else {
            setSecondGrid(true)
            setGrid_2(thereByThereGird)
            var alength = attachLength;
            var thirdByThirdItem = 0;
            do {
                alength -= 3;
                thirdByThirdItem += 3
            } while (alength >= 3)
            setThirdItemStart(alength)
            setSecondHeight(181)
            setSecondWidth(181)
            if (alength === 2) {
                setGrid(oneByTwoGrid_2)
                setFirstGridItem(oneByTwoGridItem)
                setSecondGridItem(oneByTwoGridItem)
                setSecondRow(true)
                setSecondRowItems(alength / 2)
                setWidth(273)
                setHeight(273)
            }
            else if (alength === 1) {
                setGrid(oneByOneGrid)
                setItemStart(alength)
                setWidth(550)
                setHeight(257)
            }
        }
    }, [])
    const getThumbnail = (attachmentName, width, height) => {
        var url = BaseUrl + (width != 0 ? `api/FileUpload/attachment/download?fileName=${attachmentName}&width=${width}` : `api/FileUpload/attachment/download?fileName=${attachmentName}`)
        if (height !== 0) {
            url += `&height=${height}`
        }
        return url
    }
    const handleImageFocus = (initialIndex) => {
        var items = { modals: [] };
        attachments.forEach(function (attachment, index) {
            const modal = {
                type: attachment.fileType,
                contentName: attachment.name,
                contentUrl: attachment.url,
                width: attachment.width,
                height: attachment.height,
            };
            items.modals.push(modal)
        })
        setModal(items)
        setInitialItem(initialIndex)
    }

    function generateAttachment(a, getThumbnail, width, height, handleImageFocus, idx, offset, carousel)  {
        switch(a.fileType) {
            case ".jpg":
            case ".jpeg":
            case ".webp":
                return <AttachmentImage attachment={a} getThumbnail={getThumbnail} width={width} height={height} onClick={() => handleImageFocus(idx+offset)} />
            case ".mp4":
            case ".webm":
                return <AttachmentVideo attachment={a} getThumbnail={getThumbnail} width={width} height={height} onClick={() => handleImageFocus(idx+offset)} carousel={carousel}/>
            default:
                return null
        }
    }

    return (
        <>
            <div className="attachmentContainer">
                <div className="w-full h-full max-w-[550px] rounded overflow-hidden justify-self-start self-start">
                    <div className={grid}>
                        {secondRow ?
                            <>
                                <div className={firstGridItem}>
                                    {attachments.slice(0, secondRowItems).map((a, idx) => {
                                        return generateAttachment(a, getThumbnail, width, height, handleImageFocus, idx, 0, true)
                                    })}
                                </div>
                                <div className={secondGridItem}>
                                    {attachments.slice(secondRowItems, secondRowItems + 1).map((a, idx) => {
                                        return generateAttachment(a, getThumbnail, width, height, handleImageFocus, idx, secondRowItems, true)
                                    })}
                                </div>
                            </>
                            :
                            attachments.slice(0, itemStart).map((a, idx) => {
                                return generateAttachment(a, getThumbnail, width, height, handleImageFocus, idx, 0, false)
                            })
                        }
                    </div>
                    {secondGrid ?
                        <div className={grid_2}>
                            {attachments.slice(thirdItemStart).map((a, idx) => {
                                return generateAttachment(a, getThumbnail, width, height, handleImageFocus, idx, thirdItemStart, true)
                            })}
                        </div>
                        : null}
                </div >
            </div >

        </>
    );
}