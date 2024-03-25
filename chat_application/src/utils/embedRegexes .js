const embedRegexes = [
    {
        // https://www.youtube.com/watch?v=QdBZY2fkU-0
        regex: /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-z0-9_-]+)/,
        type: 'youtube'
    },
    {
        // https://youtu.be/QdBZY2fkU-0?si=8vqK3bmvMaJPzx5S
        regex: /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/,
        type: 'youtube'
    },
    {
        regex: /(https?:\/\/)/,
        type: 'link'
    }

];
export default embedRegexes;
