
/**
* Use this file to define custom functions and blocks.
* Read more at https://arcade.makecode.com/blocks/custom
*/

enum Location {
    //% block="left"
    Left,
    //% block="right"
    Right,
    //% block="forward"
    Forward
}

const LOCATION = {
    [Location.Left]: "left",
    [Location.Right]: "right",
    [Location.Forward]: "forward"
}

const FacingLeft = platformer.PlatformerSpriteState.FacingLeft
const FacingRight = platformer.PlatformerSpriteState.FacingRight
const Falling = platformer.PlatformerSpriteState.Falling
const OnGround = platformer.PlatformerSpriteState.OnGround
const Moving = platformer.PlatformerSpriteState.Moving


const TO_PREDICATE = {
    [Location.Left]: [FacingLeft | Moving],
    [Location.Right]: [FacingRight | Moving],
    [Location.Forward]: [FacingLeft, FacingRight, Falling, OnGround] as number[]
} 

//% blockId="convert_location" block="$location"
function convertLocation(location: Location): string {
    return LOCATION[location];
}

//% weight=100 color=#ff7f00 icon="\uf0c8"
namespace numberblocks {
    /**
     * Set up a Sprite with the animations for a particular
     * numberblock and direction.
     *
     * @param s The sprite object to animate
     * @param number The numberblock number, eg: 1, 2, 3
     * @param direction The direction of the animation
     */
    //% block="assign $s to numberblock $number moving $direction"
    //% direction.shadow=convert_location
    //% advanced=true
    export function assignDirection(s: platformer.PlatformerSprite, number: number, direction: Location) {
        const rules = TO_PREDICATE[direction]

        for (const rule of rules) {
            platformer.loopFrames(
                s,
                getAnimation(number, convertLocation(direction)),
                500,
                rule
            )
        }
    }

    //% block="the numberblock number for $s"
    //% group="Numberblock Numbers"
    export function getNumberblockNumber(s: Sprite): number {
        return sprites.readDataNumber(s, "numberblock")
    }

    //% block="set the numberblock number for $s to $number"
    //% group="Numberblock Numbers"
    //% advanced=true
    export function setNumberblockNumber(s: Sprite, number: number): void {
         sprites.setDataNumber(s, "numberblock", number)
    }

    /**
     * Set up a Sprite with the animations for a particular
     * numberblock.
     * 
     * @param s The sprite object to animate
     * @param number The numberblock number, eg: 1, 2, 3
     */
    //% block="make $s be numberblock $number"
    //% group="Numberblock Numbers"
    export function assign(s: platformer.PlatformerSprite, number: number) {
        const primary = getImage(number)

        realign(s, primary)

        assignDirection(s, number, Location.Left)
        assignDirection(s, number, Location.Right)
        assignDirection(s, number, Location.Forward)
        sprites.setDataNumber(s, "numberblock", number)

        if (s.kind() === SpriteKind.Player) {
            info.setScore(number)
        }
    }

    //% block="numberblock $number is available"
    //% group="Numberblock Numbers"
    export function isNumberblockAvailable(number: number): boolean {
        return getImage(number) !== null
    }

    function realign(s: Sprite, image: Image) {
        const oldHeight = s.height
        const newHeight = image.height

        const delta = oldHeight - newHeight
        s.y += delta
    }

    /**
     * Get an animation for a specific numberblock and direction.
     * 
     * @param number The numberblock number, eg: 1, 2, 3
     * @param direction The direction of the animation
     * @returns An animation
     */
    //% block="animation for numberblock $number moving $direction"
    //% direction.shadow=convert_location
    //% group="Utilities"
    //% advanced=true
    export function getAnimation(number: number, direction: string): Image[] {
        if (direction === "forward") {
            return [helpers.getImageByName(`numberblock-${number}`)]
        } else {
            return helpers.getAnimationByName(`numberblock-${number}-${direction}`)
        }
    }

    //% block="image for numberblock $number"
    //% group="Utilities"
    //% advanced=true
    export function getImage(number: number): Image {
        return helpers.getImageByName(`numberblock-${number}`)
    }

    function _createNumberblock(number: number, { location = null, kind }: { location?: tiles.Location | null, kind: number }) {
        const sprite = platformer.create(getImage(number), kind)
        assign(sprite, number)

        if (location) {
            sprite.setPosition(location.x, location.y)
        }

        sprites.setDataNumber(sprite, "numberblock", number)

        return sprite
    }

    //% block="create numberblock || $number || at $location"
    //% number.defl=1
    //% expandableArgumentMode="enabled"
    //% help=github:wycats/numberblocks/docs/create-numberblock
    //% group="Lifecycle"
    export function createNumberblock(number = 1, location: tiles.Location = null) {
        return _createNumberblock(number, { location, kind: SpriteKind.NPC })
    }

    //% block="create player: numberblock || $number"
    //% number.defl=1
    //% blockSetVariable=playerSprite
    //% group="Lifecycle"
    export function createPlayer(number = 1): Sprite {
        const numberblock = _createNumberblock(number, { kind: SpriteKind.Player });
        scene.cameraFollowSprite(numberblock)
        numberblocks.assign(numberblock, number)
        platformer.moveSprite(numberblock,true, 100, controller.player1)
        platformer.setFeatureEnabled(platformer.PlatformerFeatures.JumpOnAPressed, true)
        info.setScore(number)

        return numberblock;
    }

    //% block="an array of numberblocks"
    //% blockSetVariable=numberblocks
    //% group="Utilities"
    export function createNumberblocks(): platformer.PlatformerSprite[] {
        return []
    }
}
