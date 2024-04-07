import { useEffect, useState } from "react";
import { BaseUrl } from "../shared";
import AttachmentImage from "./AttachmentImage";
import { UseModal } from "../ModalContext";

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
            const image = attachments[0]
            const divisor = image.width / 550
            const rezieHeight = parseInt(Math.round(image.height / divisor))
            if (rezieHeight > 350) {
                setWidth(Math.floor(image.width / 2.22))
            } else {
                setWidth(550)
            }
            if (image.width < 550) {
                setWidth(image.width)
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
    const getThumnail = (attachmentName, width, height) => {
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

    return (
        <>
            <div className="attachmentContainer">
                <div className="w-full h-full max-w-[550px] rounded overflow-hidden justify-self-start self-start">
                    <div className={grid}>
                        {secondRow ?
                            <>
                                <div className={firstGridItem}>
                                    {attachments.slice(0, secondRowItems).map((a, idx) => {
                                        return (
                                            <AttachmentImage attachmnet={a} getThumnail={getThumnail} width={width} height={height} onClick={() => handleImageFocus(idx)} />
                                        );
                                    })}
                                </div>
                                <div className={secondGridItem}>
                                    {attachments.slice(secondRowItems, secondRowItems + 1).map((a, idx) => {
                                        return (
                                            <AttachmentImage attachmnet={a} getThumnail={getThumnail} width={width} height={height} onClick={() => handleImageFocus(idx + secondRowItems)} />
                                        );
                                    })}
                                </div>
                            </>
                            :
                            attachments.slice(0, itemStart).map((a, idx) => {
                                return (
                                    <AttachmentImage attachmnet={a} getThumnail={getThumnail} width={width} height={height} onClick={() => handleImageFocus(idx)} />
                                );
                            })
                        }
                    </div>
                    {secondGrid ?
                        <div className={grid_2}>
                            {attachments.slice(thirdItemStart).map((a, idx) => {
                                return (
                                    <AttachmentImage attachmnet={a} getThumnail={getThumnail} width={secondWidth} height={secondHeight} onClick={() => handleImageFocus(idx + thirdItemStart)} />
                                );
                            })}
                        </div>
                        : null}
                </div >
            </div >

        </>
    );
}