import { useEffect, useState } from "react";
import { BaseUrl } from "../shared";
import AttachmentImage from "./AttachmentImage";
import ImageFoucsModal from "./ImageFoucsModal";

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

    const [imageFocus, setImageFocus] = useState(false);

    useEffect(() => {
        var grid
        var attachLength = attachments.length
        if (attachLength === 1) {
            setGrid(oneByOneGrid)
            setWidth(550)
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
            console.log(alength, thirdByThirdItem)
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
        var url = BaseUrl + (width != 0 ? `api/FileUpload/attachment/dowload?fileName=${attachmentName}&width=${width}` : `api/FileUpload/attachment/dowload?fileName=${attachmentName}`)
        if (height !== 0) {
            url += `&height=${height}`
        }
        return url
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
                                            <AttachmentImage attachmnet={a} getThumnail={getThumnail} width={width} height={height} />
                                        );
                                    })}
                                </div>
                                <div className={secondGridItem}>
                                    {attachments.slice(secondRowItems, secondRowItems + 1).map((a, idx) => {
                                        return (
                                            <AttachmentImage attachmnet={a} getThumnail={getThumnail} width={width} height={height} />
                                        );
                                    })}
                                </div>
                            </>
                            :
                            attachments.slice(0, itemStart).map((a, idx) => {
                                return (
                                    <AttachmentImage attachmnet={a} getThumnail={getThumnail} width={width} height={height} />
                                );
                            })
                        }
                    </div>
                    {secondGrid ?
                        <div className={grid_2}>
                            {attachments.slice(thirdItemStart).map((a, idx) => {
                                return (
                                    <AttachmentImage attachmnet={a} getThumnail={getThumnail} width={secondWidth} height={secondHeight} />
                                );
                            })}
                        </div>
                        : null}
                </div >
            </div >

        </>
    );
}