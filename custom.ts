
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

const TO_PREDICATE = {
    [Location.Left]: Predicate.MovingLeft,
    [Location.Right]: Predicate.MovingRight,
    [Location.Forward]: Predicate.NotMoving
}

//% blockId="convert_location" block="$location"
function convertLocation(location: Location): string {
    return LOCATION[location];
}



/**
 * Custom blocks
 */
//% weight=100 color=#0fbc11 icon=""
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
    export function assignDirection(s: Sprite, number: number, direction: Location) {
        characterAnimations.loopFrames(
            s,
            getAnimation(number, convertLocation(direction)),
            500,
            characterAnimations.rule(TO_PREDICATE[direction])
        )
    }

    /**
     * Set up a Sprite with the animations for a particular
     * numberblock.
     * 
     * @param s The sprite object to animate
     * @param number The numberblock number, eg: 1, 2, 3
     */
    //% block="make $s be numberblock $number"
    export function assign(s: Sprite, number: number) {
        s.setImage(helpers.getImageByName(`numberblock-${number}`));
        assignDirection(s, number, Location.Left);
        assignDirection(s, number, Location.Right);
        assignDirection(s, number, Location.Forward);
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
    export function getAnimation(number: number, direction: string): Image[] {
        return helpers.getAnimationByName(`numberblock-${number}-${direction}`)
    }

    //% block="create numberblock || $number"
    //% number.defl=1
    //% help=github:wycats/numberblocks/docs/create-numberblock
    export function createNumberblock(number: number) {
        const sprite = sprites.create(img`...`, SpriteKind.Player)
        sprite.ay = 200

        if (number !== undefined) {
            assign(sprite, number)
        }

        return sprite
    }

    //% block="create player: numberblock || $number"
    //% number.defl=1
    //% blockSetVariable=playerSprite
    export function createPlayer(number = 1): Sprite {
        const numberblock = createNumberblock(number);
        scene.cameraFollowSprite(numberblock)
        numberblocks.assign(numberblock, number)
        controller.moveSprite(numberblock, 100, 0)

        return numberblock;
    }

}
