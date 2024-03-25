import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createEditor, Editor, Element, Text, Node, Range, Transforms } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import findUrlsInText from "../utils/findUrlsInText";

export default function SendMessageForm({ sendMessage }) {
    const initialValue = [
        {
            type: 'paragraph',
            children: [{ text: '' }],
        },
    ]

    const [messages, setMessage] = useState([]);
    const textAreaRef = useRef()
    const [editor] = useState(() => withReact(createEditor()))

    useEffect(() => {
        textAreaRef.current.style.height = (messages.length + 1) * 22 + 'px';
    }, [messages])

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
        setMessage(messages);
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
    const handleKeyDown = event => {
        if (event.key === 'Enter') {
            if (!event.shiftKey) {
                event.preventDefault();
                const msg = messages.map(m => m.children[0].text + '\n').join('')
                sendMessage(msg)
                setMessage(initialValue);
                setEmpty();
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
    return (
        <form className="relative px-[16px] shrink-0">
            <div className="bg-[#EBEDEF] relative w-full mb-[24px] rounded-lg indent-0">
                <div className="overflow-x-hidden overflow-y-scroll max-h-[50vh] rounded-lg scrollbarContainer">
                    <div className="flex relative">
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
