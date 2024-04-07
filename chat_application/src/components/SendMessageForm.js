import React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createEditor, Transforms } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import findUrlsInText from "../utils/findUrlsInText";
import AttachmentItem from "./AttachmentItem";

export default function SendMessageForm({ setMessages, sendMessage, chatRoomId, conn }) {
    const [input, setInput] = useState([]);
    const [attachList, setAttachList] = useState([]);
    const textAreaRef = useRef()
    const [editor] = useState(() => withReact(createEditor()))
    const inputRef = useRef(null);

    useEffect(() => {
        textAreaRef.current.style.height = (input.length + 1) * 22 + 'px';
    }, [input])

    const embedRegexes = [
        {
            //https://www.youtube.com/watch?v=QdBZY2fkU-0
            regex: /https:\/\/www\.youtube\.com\/watch\?v=(\w+)/,
            type: 'youtube'
        },
        {
            //https://youtu.be/QdBZY2fkU-0?si=8vqK3bmvMaJPzx5S
            regex: /https:\/\/youtu\.be\/([\w-]+)/,
            type: 'youtube'
        },
    ]

    const initialValue = [
        {
            type: 'paragraph',
            children: [{ text: '' }],
        },
    ]

    const CustomEditor = {
        handleEmbed(editor, event) {
            const text = event.clipboardData.getData('text/plain')
            embedRegexes.some(({ regex, type }) => {
                const match = text.match(regex)
                if (match) {
                    event.preventDefault()
                    //console.log('match', type, match[1])
                    // Transforms.insertNodes(editor, {
                    //     children: [{ text }],
                    //     type,
                    //     youtubeId: match[1],
                    // })
                    Transforms.insertText(editor, text, { data: { class: "custom-class" } })
                    return true
                }
                return false
            })
        },
        handlePaste(editor, event) {
            event.preventDefault()
            const text = event.clipboardData.getData('text/plain')
            const urlRegex = /https?:\/\/[^\s]+/
            if (text.match(urlRegex)) {
                Transforms.insertNodes(editor, {
                    children: [{ text }],
                    type: 'link',
                })
            } else {
                Transforms.insertText(editor, {
                    children: [{ text }],
                })
            }

        }
    }

    const handleChange = messages => {
        setInput(messages);
    }
    const setEmpty = () => {
        const point = { path: [0, 0], offset: 0 }
        editor.selection = { anchor: point, focus: point };
        editor.history = { redos: [], undos: [] };
        editor.children = [{
            type: "paragraph",
            children: [{ text: "" }],
        }];
    }
    const handleKeyDown = async event => {
        if (event.key === 'Enter') {
            if (!event.shiftKey) {
                event.preventDefault();
                setInput(initialValue);
                setEmpty();
                const msg = input.map(m => m.children[0].text + '\n').join('')
                if (attachList.length > 0) {
                    setAttachList([])
                    const { messageId, uploadResults } = await sendMessage(msg, attachList)
                    let attachments = []
                    uploadResults.forEach(upload => {
                        if(upload.status === 'fulfilled') {
                            attachments.push(upload.value.data.attachemnt)
                            conn.invoke("NotifyAttachment", chatRoomId, messageId)
                        }
                    })
                    setMessages(prevMessages => {
                        return prevMessages.map(message => {
                            if (message.id === messageId) {
                                return { ...message, attachments: attachments};
                            }
                            return message;
                        });
                    });
                } else {
                    await sendMessage(msg)
                }
            }
        }
    }


    const myDecorator = ([node, path]) => {
        const nodeText = node.text;
        if (!nodeText) return [];
        const urls = findUrlsInText(nodeText);

        return urls.map(([url, index]) => {
            return {
                anchor: {
                    path,
                    offset: index,
                },
                focus: {
                    path,
                    offset: index + url.length,
                },
                decoration: "link",
            };
        });
    };

    const renderLeaf = ({ attributes, children, leaf }) => {
        if (leaf.decoration === "link") {
            return <span {...attributes} className="text-[#006CE7]">{children}</span>
        }
        return <span {...attributes}>{children}</span>
    }

    const DefaultElement = props => <div {...props.attributes} >
        {props.children}
    </div>
    const LinkElement = props => <div {...props.attributes}>
        {props.children}
    </div>

    const renderElement = useCallback(props => {
        switch (props.element.type) {
            case 'link':
                return <LinkElement {...props} />
            default:
                return <DefaultElement {...props} />
        }
    }, [])

    const handleAddAttachmnet = () => {
        inputRef.current.click();
    }

    const handleAttachmentChange = (event) => {
        const files = event.target.files
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if (files) {
            const filesArray = Array.from(files)
            filesArray.forEach((file) => {
                const fileName = file.name.toLowerCase()
                const extension = fileName.substring(fileName.lastIndexOf('.') + 1)
                const isImageByExtension = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)

                const isImageByType = allowedTypes.includes(file.type)

                if (isImageByExtension || isImageByType) {
                    setAttachList(preFile => [...preFile, file])
                }
            })
        }
    }
    const deleteFile = (id) => {
        setAttachList(preAttachList => preAttachList.filter((item, idx) => idx !== id))
    }
    return (
        <form className="relative px-[16px] shrink-0">
            <div className="bg-[#EBEDEF] relative w-full mb-[24px] rounded-lg indent-0">
                <div className="overflow-x-hidden overflow-y-scroll max-h-[50vh] rounded-lg scrollbarContainer">
                    {attachList.length > 0 && attachList ?
                        <>
                            <ul className="flex gap-[24px] margin top-0 right-0 bottom-[2px] left-[6px] pt-[20px] px-[10px] pb-[10px] overflow-x-auto list-none">
                                {attachList.map((file, idx) => {
                                    return (
                                        <React.Fragment key={idx}>
                                            <AttachmentItem file={file} deleteFile={() => deleteFile(idx)} />
                                        </React.Fragment>
                                    )
                                })}
                            </ul>
                            <div className="divider divider-primary m-0 h-0"></div>
                        </>
                        : null}
                    <div className="flex relative">
                        <div className="attachWrapper">
                            <button type="button" className="attachButton" onClick={() => handleAddAttachmnet()}>
                                <input ref={inputRef} type="file" accept='image/*' id="myfile" name="myfile" className='hidden' onChange={handleAttachmentChange} multiple />
                                <div className="h-[25px] w-[25px] p-1 bg-[#7CFFEC] rounded-full">
                                    <div className="w-full h-full attachButon_inner" style={{ backgroundImage: `url(https://res.cloudinary.com/dfo61m8dy/image/upload/v1711545774/plus_heljrn.png)`, backgroundSize: 'cover' }}></div>
                                </div>
                            </button>
                        </div>
                        <div ref={textAreaRef} className="font-medium textArea">
                            <div>
                                <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
                                    <Editable className="markup slateTextArea fontSizePadding font-medium outline-none"
                                        //renderElement={renderElement}
                                        renderLeaf={renderLeaf}
                                        onKeyDown={handleKeyDown}
                                        //onPaste={(event) => {
                                        //CustomEditor.handlePaste(editor, event)
                                        //}}
                                        decorate={myDecorator}
                                    />
                                </Slate>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form >
    );
}
