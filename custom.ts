
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

enum NumberblockKind {
    NPC,
    Player
}

namespace numberblock_kind {
    //% shim=KIND_GET
    //% blockId=numberblock_kind block="$kind"
    //% kindNamespace=SpriteKind kindMemberName=kind
    export function _numberblockKind(kind: number): number {
        return kind;
    }

    //% isKind
    export const NPC = NumberblockKind.NPC

    //% isKind
    export const Player = NumberblockKind.Player
}

//% blockId="convert_numberblock_kind" block="$kind=numberblock_kind"
function convertNumberblockKind(kind: NumberblockKind): number {
    switch (kind) {
        case NumberblockKind.NPC:
            return SpriteKind.NPC;
        case NumberblockKind.Player:
            return SpriteKind.Player;
    }
}

//% weight=100 color=#ff7f00 icon="\uf0c8"
namespace numberblocks {

    //% block="destroy numberblock $s || with $effect"
    //% group="Lifecycle"
    //% effect.defl=effects.warmRadial
    export function destroy(s: platformer.PlatformerSprite, effect?: effects.ParticleEffect) {
        platformer.setCharacterAnimationsEnabled(s, false)
        sprites.destroy(s, effect || effects.warmRadial, 500)
    }

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
        const animation = getAnimation(number, direction)

        for (const rule of rules) {
            platformer.loopFrames(s, animation, 500, rule)
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
    export function getAnimation(number: number, direction: Location): Image[] {
        if (direction === Location.Forward) {
            return [helpers.getImageByName(`numberblock-${number}`)]
        } else if (direction === Location.Right) {
            return helpers.getAnimationByName(`numberblock-${number}-right`)
        } else {
            return asset_utils.flip_video(helpers.getAnimationByName(`numberblock-${number}-right`), FlipDirection.Horizontally)
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
    export function createNumberblocks(): Numberblock[] {
        return []
    }

    //% block="numberblock"
    //% group="2.0"
    export class Numberblock {
        static create(n: number, location: tiles.Location, kind: NumberblockKind) {
            const sprite = platformer.create(numberblocks.getImage(n), kind)
            numberblocks.assign(sprite, n)

            if (location) {
                sprite.setPosition(location.x, location.y)
            }

            const numberblock = new Numberblock(sprite, n)
            sprite.data.numberblock = numberblock
            return numberblock
        }

        static fromSprite(sprite: Sprite): Numberblock | null {
            return sprite.data.numberblock || null

        }

        private _sprite: platformer.PlatformerSprite
        private _numberblock: number

        constructor(
            sprite: platformer.PlatformerSprite,
            numberblock: number
        ) { 
            this._sprite = sprite
            this._numberblock = numberblock
        }

        //% blockCombine block="platformer sprite" group="2.0"
        //% blockSetVariable=numberblock
        get sprite(): platformer.PlatformerSprite {
            return this._sprite
        }

        //% blockCombine block="current number" group="2.0"
        //% blockSetVariable=numberblock
        get numberblock(): number {
            return this._numberblock
        }

        //% group="Overlaps"
        //% weight=100 draggableParameters="reporter"
        //% blockId=hitoverlap block="on $this overlaps $kind=numberblock_kind"
        //% kind.shadow=convert_numberblock_kind
        //% blockGap=8
        onOverlap(kind: NumberblockKind, handler: (other: Numberblock) => void) {
            sprites.onOverlap(this.sprite.kind(), kind, (sprite, otherSprite) => {
                if (sprite === this.sprite) {
                    const other = Numberblock.fromSprite(otherSprite)
                    if (other) {
                        handler(other)
                    }
                }
            })
        }


        //% block="destroy numberblock $this || with $effect"
        //% group="2.0"
        //% this.defl=numberblock
        //% this.shadow=variables_get
        //% effect.defl=effects.warmRadial
        destroy(effect?: effects.ParticleEffect) {
            platformer.setCharacterAnimationsEnabled(this.sprite, false)
            sprites.destroy(this.sprite, effect || effects.warmRadial, 500)
        }
    }

    //% block="create player: numberblock || $number"
    //% number.defl=1
    //% blockSetVariable=playerSprite
    //% group="Lifecycle"
    export function createNumberblockPlayer(n = 1) {
        const numberblock = Numberblock.create(n, null, NumberblockKind.Player);
        scene.cameraFollowSprite(numberblock.sprite)
        numberblocks.assign(numberblock.sprite, n)
        platformer.moveSprite(numberblock.sprite, true, 100, controller.player1)
        platformer.setFeatureEnabled(platformer.PlatformerFeatures.JumpOnAPressed, true)
        info.setScore(n)

        return numberblock;
    }


    //% block="create numberblock npc || $n at $location"
    //% blockSetVariable=numberblock
    //% n.defl=1
    //% location.shadow=variables_get location.defl=location
    //% expandableArgumentMode="enabled"
    //% help=github:wycats/numberblocks/docs/create-numberblock
    //% group="Lifecycle"
    export function createNumberblockNPC(n = 1, location: tiles.Location = null): Numberblock {
        return Numberblock.create(n, location, NumberblockKind.NPC)
    }



}

