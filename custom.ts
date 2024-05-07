
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

//% block
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
    //% block="assign $s to numberblock $number moving $direction || with variant $variant"
    //% direction.shadow=convert_location
    //% variant.defl=""
    //% advanced=true
    export function assignDirection(s: platformer.PlatformerSprite, number: number, direction: Location, variant?: string) {
        const rules = TO_PREDICATE[direction]
        const animation = getAnimation(number, direction, variant)

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
    //% block="make $s=variables_get be numberblock $number || with variant $variant"
    //% group="Numberblock Numbers"
    //% variant.defl=""
    export function assign(s: platformer.PlatformerSprite, number: number, variant?: string) {
        const primary = getImage(number, variant)
        const bottom = s.bottom

        s.setImage(primary)
        assignDirection(s, number, Location.Left, variant)
        assignDirection(s, number, Location.Right, variant)
        assignDirection(s, number, Location.Forward, variant)

        s.bottom = bottom

        if (s.kind() === SpriteKind.Player) {
            info.setScore(number)
        }
    }

    //% block="numberblock $number is available || with variant $variant"
    //% group="Numberblock Numbers"
    //% variant.defl=""
    export function isNumberblockAvailable(number: number, variant?: string): boolean {
        return getImage(number, variant) !== null
    }

    /**
     * Get an animation for a specific numberblock and direction.
     * 
     * @param number The numberblock number, eg: 1, 2, 3
     * @param direction The direction of the animation
     * @returns An animation
     */
    //% block="animation for numberblock $number moving $direction || with variant $variant"
    //% direction.shadow=convert_location
    //% variant.defl=""
    //% group="Utilities"
    //% advanced=true
    export function getAnimation(number: number, direction: Location, variant?: string): Image[] {
        if (direction === Location.Forward) {
            return [helpers.getImageByName(`numberblock-${number}${variant || ""}`)]
        } else if (direction === Location.Right) {
            return helpers.getAnimationByName(`numberblock-${number}${variant || ""}-right`)
        } else {
            return asset_utils.flip_video(helpers.getAnimationByName(`numberblock-${number}${variant || ""}-right`), FlipDirection.Horizontally)
        }
    }

    //% block="image for numberblock $number"
    //% group="Utilities"
    //% advanced=true
    export function getImage(number: number, variant?: string): Image {
        return helpers.getImageByName(`numberblock-${number}${variant || ""}`)
    }

    //% block="an array of numberblocks"
    //% blockSetVariable=numberblocks
    //% group="Utilities"
    export function createNumberblocks(): Numberblock[] {
        return []
    }

    export class Numberblock {
        static create(n: number, location: tiles.Location, kind: NumberblockKind) {
            const sprite = platformer.create(numberblocks.getImage(n), convertNumberblockKind(kind))
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
        private _variant: string

        constructor(
            sprite: platformer.PlatformerSprite,
            numberblock: number
        ) { 
            this._sprite = sprite
            this._numberblock = numberblock
            this._variant = ""
        }

        //% block="move $this to the next variant"
        //% this.defl=numberblock
        //% group="2.0"
        nextVariant(): void {
            if (this._variant === '') {
                if (isNumberblockAvailable(this.numberblock, 'A')) {
                    this._variant = 'A'
                    assign(this.sprite, this.numberblock, 'A')
                }
                return
            }

            const nextVariant = String.fromCharCode(this._variant.charCodeAt(0) + 1);

            if (isNumberblockAvailable(this.numberblock, nextVariant)) {
                this._variant = nextVariant
                assign(this.sprite, this.numberblock, nextVariant)
            } else {
                this._variant = ''
                assign(this.sprite, this.numberblock)
            }
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

        //% blockCombine block="current number" group="2.0"
        //% blockSetVariable=numberblock
        set numberblock(n: number) {
            if (this._numberblock !== n) {
                this._numberblock = n
                assign(this.sprite, n)

            }
        }

        //% block="destroy numberblock $this=variables_get || with $effect"
        //% group="2.0"
        //% this.defl=numberblock
        //% effect.defl=effects.warmRadial
        destroy(effect?: effects.ParticleEffect) {
            platformer.setCharacterAnimationsEnabled(this.sprite, false)
            sprites.destroy(this.sprite, effect || effects.warmRadial, 500)
        }
    }

    //% block="create numberblock player || $n"
    //% n.defl=1
    //% blockSetVariable=playerSprite
    //% group="Lifecycle"
    export function createNumberblockPlayer(n = 1) {
        const numberblock = Numberblock.create(n, null, NumberblockKind.Player);
        scene.cameraFollowSprite(numberblock.sprite)
        numberblocks.assign(numberblock.sprite, n)
        platformer.moveSprite(numberblock.sprite, true, 100, controller.player1)
        platformer.setFeatureEnabled(platformer.PlatformerFeatures.JumpOnAPressed, true)
        info.setScore(n)

        player = numberblock
        return numberblock;
    }

    let player: Numberblock | null

    //% block="create numberblock npc at $location=variables_get || as $n"
    //% n.defl=1
    //% location.defl=location
    //% help=github:wycats/numberblocks/docs/create-numberblock
    //% group="Lifecycle"
    export function createNumberblockNPCAt(location: tiles.Location, n = 1): void {
        Numberblock.create(n, location, NumberblockKind.NPC)
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

    //% group="Overlaps"
    //% draggableParameters="reporter"
    //% block="when $nb=variables_get overlaps $other || $kind=convert_numberblock_kind"
    //% blockId="nboverlap"
    //% nb.defl="numberblock"
    //% kind.defl=NumberblockKind.NPC
    //% other.defl="other"
    //% handlerStatement
    export function onOverlap(nb: Numberblock, kind: NumberblockKind, handler: (other: Numberblock) => void) {
        platformer_tiles.onOverlap(nb.sprite.kind(), convertNumberblockKind(kind), (sprite, otherSprite) => {
            if (sprite === nb.sprite) {
                const other = Numberblock.fromSprite(otherSprite)
                if (other) {
                    handler(other)
                }
            }
        })
    }

    //% group="Overlaps"
    //% draggableParameters="reporter"
    //% block="when $player overlaps $numberblock"
    //% blockId="nbplayeroverlap"
    export function onPlayerOverlap(handler: (player: Numberblock, numberblock: Numberblock) => void) {
        platformer_tiles.onOverlap(SpriteKind.Player, SpriteKind.NPC, (sprite, otherSprite) => {
            if (sprite === player.sprite) {
                const other = Numberblock.fromSprite(otherSprite)
                if (other) {
                    handler(player, other)
                }
            }
        })
    }
}
