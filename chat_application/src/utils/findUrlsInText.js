export default function findUrlsInText(text) {
    const urlRegex = /https?:\/\/[^\s]+/
    const matches = text.match(urlRegex);
    return matches ? matches.map((m) => [m.trim(), text.indexOf(m.trim())]) : [];
}