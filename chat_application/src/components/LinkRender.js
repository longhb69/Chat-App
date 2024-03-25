import { useEffect, useState } from "react"
import embedRegexes from "../utils/embedRegexes "

export default function LinkRender({ link, type }) {

    const YouTubeEmbed = (link) => {
        const [channelName, setChannelName] = useState('');
        const [videoName, setVideoName] = useState('');
        const [channelId, setChannelId] = useState();
        const [play, setPlay] = useState(false)
        const apiKey = 'AIzaSyA_e8fP1BotG4eRszVpfUfN4arDM9gWlxI'


        useEffect(() => {
            fetchChannelName();
        }, [])

        function getId() {
            for (const { regex } of embedRegexes) {
                if (link.match(regex)) {
                    return link.match(regex)[1]
                }
            }
        }
        async function fetchChannelName() {
            try {
                const videoResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${getId()}&key=${apiKey}`);
                const videoData = await videoResponse.json();
                setChannelName(videoData.items[0].snippet.channelTitle)
                setVideoName(videoData.items[0].snippet.title)
                setChannelId(videoData.items[0].snippet.channelId)
            } catch (error) {
                console.error('Error fetching channel name:', error);
                throw error;
            }
        }

        return (
            <div className="youtube-container">
                <article className="max-w-[432px] self-start border-[#FF0000] border-l-4 rounded bg-[#F2F3F5] relative embedWrapper">
                    <div className="max-w-[516px]">
                        <div className="grid-1">
                            <div className="font-medium text-xs leading-4 mt-[8px]"><a className="cursor-pointer no-underline text-[#121212] text-left hover:underline" href='https://www.youtube.com' target="_blank" rel="noreferrer noopener">Youtube</a></div>
                            <div className="flex items-center mt-[8px]"><a className="cursor-pointer no-underline text-[#121212] text-left hover:underline font-medium text-[0.875rem]" href={`https://www.youtube.com/channel/${channelId}`} rel="noreferrer noopener" target="_blank">{channelName}</a></div>
                            <div className="mt-[8px] text-base font-semibold text-[#006CE7]"><a className="cursor-pointer no-underline text-left hover:underline" href={link} rel="noreferrer noopener" target="_blank">{videoName}</a></div>
                            {play
                                ?
                                <div className="embedMedia">
                                    <div className="flex relative max-w-[400px] pb-[56.25%] object-fill w-full">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${getId()}?autoplay=1&auto_play=1`}
                                            className="absolute top-0 left-0 max-w-[400px] max-h-[225px] w-full h-full"
                                            title="YouTube Video"
                                            allowFullScreen
                                            allow="autoplay"
                                        />
                                    </div>
                                </div>
                                :
                                <>
                                    <div className="max-w-[400px] mt-[16px] flex relative">
                                        <div className="imageContent ">
                                            <div className="imageContainer">
                                                <div className="overflow-hidden max-w-[400px] w-full aspect-[400/225] rounded cursor-pointer relative">
                                                    <div className="w-full h-full">
                                                        <div className="w-full h-full aspect-[1.77778 / 1]">
                                                            <img alt="Hình ảnh" src={`https://img.youtube.com/vi/${getId()}/hqdefault.jpg`} className="max-w-[400px] max-h-[225px] w-full h-full rounded aspect-[400/225] object-cover" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute top-0 left-0 bottom-0 right-0  z-2 flex justify-center items-center">
                                            <div className="wrapper">
                                                <div className="icon-wrapper" onClick={() => setPlay(true)}>
                                                    <svg class="w-[24px] h-[24px]" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M9.25 3.35C7.87 2.45 6 3.38 6 4.96v14.08c0 1.58 1.87 2.5 3.25 1.61l10.85-7.04a1.9 1.9 0 0 0 0-3.22L9.25 3.35Z" class=""></path></svg>
                                                </div>
                                                <a href={link} target="_blank" className="icon-wrapper text-[#fff]" rel="noreferrer noopener">
                                                    <svg aria-label="Mở Link" class="w-[24px] h-[24px]" aria-hidden="false" role="img" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" transform="translate(3.000000, 4.000000)" d="M16 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4v-2H2V4h14v10h-4v2h4c1.1 0 2-.9 2-2V2a2 2 0 0 0-2-2zM9 6l-4 4h3v6h2v-6h3L9 6z"></path></svg>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </article>
            </div>
        )
    }
    switch (type) {
        case 'youtube':
            return YouTubeEmbed(link)
        default:
            return null
    }
}