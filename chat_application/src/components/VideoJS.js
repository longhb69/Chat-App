import React, { useEffect } from "react"
import videojs from "video.js";
import 'video.js/dist/video-js.css';

export default function VideoJS({options}) {
    const videoRef = React.useRef(null)
    const playerRef = React.useRef(null)

    useEffect(() => {
        const player = playerRef.current
        if(!player) {
            const videoElement = videoRef.current
            if(!videoElement) return

            playerRef.current = videojs(videoElement, options)
        }
    },[options, videoRef])

    // React.useEffect(() => {
    //     const player = playerRef.current;

    //     return () => {
    //     if (player && !player.isDisposed()) {
    //         player.dispose();
    //         playerRef.current = null;
    //     }
    //     };
    // }, [playerRef]);

    return (
        <div data-vjs-player className="w-full h-full">
            <video ref={videoRef} className="vjs-matrix video-js w-full h-full max-h-[inherit] "/>
        </div>
    );
}