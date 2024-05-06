enum FlipDirection {
    Horizontally,
    Vertically
}

//% block="Asset Utils"
//% weight=100 color=#ff7f00 icon="\uf87c"
namespace asset_utils {
    //% block="flip video $video $direction"
    //% direction.defl=FlipDirection.Horizontally
    export function flip_video(video: Image[], direction: FlipDirection): Image[] {
        return video.map(image => {
            const flipped = image.clone()
            flipped.flipX()
            return flipped
        })
    }
}