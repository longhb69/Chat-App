export default function withEmbeds(editor) {
    const { insertData, isInline, isVoid } = editor
    editor.insertData = (data) => {
        console.log("Data", data.getData('text/plain'))
        return insertData(data)
    }
    return editor
} 