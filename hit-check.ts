//% block="Vertical Aligment"
enum VerticalAlignment {
    Top,
    Bottom
}

//% block="Platformer Tiles"
//% weight=100 color=#ff7f00 icon="\uf12e"
namespace platformer_tiles {
    //% block="insert sprite $sprite at $at || aligned $alignment"
    //% alignment.defl=VerticalAlignment.Top
    export function insertAt(sprite: Sprite, at: tiles.Location, alignment: VerticalAlignment = VerticalAlignment.Top) {
        switch (alignment) {
            case VerticalAlignment.Top:
                sprite.setPosition(at.x, at.y)
                return
            case VerticalAlignment.Bottom: {

                const top = at.y - sprite.image.height
                sprite.setPosition(at.x, top)
            }

        }
    }

    function getColumn(x: number, scale: number) {
        const offset = 1 << (scale - 1)
        return (x - offset) >> scale
    }

    function getRow(y: number, scale: number) {
        const offset = 1 << (scale - 1);
        return (y - offset) >> scale
    }

    //% block="insert sprite $sprite at tile $tile || aligned $aligned"
    //% aligned.defl=VerticalAlignment.Bottom
    export function insertSprite(sprite: Sprite, tile: tiles.Location, aligned: VerticalAlignment = VerticalAlignment.Bottom): void {
        sprite.left = tile.left

        switch (aligned) {
            case VerticalAlignment.Top:
                sprite.top = tile.top
                return
            case VerticalAlignment.Bottom:
                sprite.bottom = tile.bottom
                return
        }
    }

    //% block="is location $tile occupied? || at $position"
    //% position.defl=TileDirection.Center
    export function isOccupied(tile: tiles.Location, position: TileDirection): boolean {
        const target = getLocAt(tile, position);
        let spriteList: Sprite[] = []
        spriteList = spriteList.concat(sprites.allOfKind(SpriteKind.Player))
        spriteList = spriteList.concat(sprites.allOfKind(SpriteKind.NPC))

        for (const sprite of spriteList) {
            const loc = sprite.tilemapLocation()
            if (isEqual(loc, target)) {
                return true
            }
        }

        return false
    }

    //% block="is location $tile available? || at $position"
    //% position.defl=TileDirection.Center
    export function isAvailable(tile: tiles.Location, position: TileDirection): boolean {
        return !isOccupied(tile, position)
    }

    //% block="is $position of sprite $sprite occupied?"
    //% position.defl=CollisionDirection.Right
    export function isSpriteOccupied(sprite: Sprite, position: CollisionDirection): boolean {
        return isOccupied(sprite.tilemapLocation(), position as number as TileDirection);
    }

    //% block="is $position of sprite $sprite available?"
    //% position.defl=CollisionDirection.Right
    export function isSpriteAvailable(sprite: Sprite, position: CollisionDirection): boolean {
        return !isOccupied(sprite.tilemapLocation(), position as number as TileDirection);
    }

    //% block="tile $a equals tile $b"
    //% advanced=1
    export function isEqual(a: tiles.Location, b: tiles.Location): boolean {
        return a.column === b.column && a.row === b.row;
    }

    //% block="if $position of sprite $sprite is available at"
    //% handlerStatement
    //% draggableParameters="reporter"
    export function ifSpriteAvailable(sprite: Sprite, position: CollisionDirection, then: (available: tiles.Location) => void) {
        timer.throttle(`${sprite.id}`, 500, () => {
            if (isSpriteAvailable(sprite, position)) {
                then(sprite.tilemapLocation().getNeighboringLocation(position))
            }
        })
    }

    //% block="if $position of location $location is available at"
    //% handlerStatement
    //% draggableParameters="reporter"
    export function ifAvailable(location: tiles.Location, position: CollisionDirection, then: (available: tiles.Location) => void) {
        timer.throttle(`${location.column}:${location.row}`, 500, () => {
            if (isAvailable(location, position as number as TileDirection)) {
                then(location.getNeighboringLocation(position))
            }
        })
    }

    //% group="Overlaps"
    //% weight=100 draggableParameters="reporter"
    //% blockId=hitoverlap block="on $sprite of kind $kind=spritekind overlaps $otherSprite of kind $otherKind=spritekind"
    //% blockGap=8
    export function onOverlap(kind: number, otherKind: number, handler: (sprite: platformer.PlatformerSprite, otherSprite: platformer.PlatformerSprite) => void) {
        sprites.onOverlap(kind, otherKind, (sprite, otherSprite) => {
            if ((sprite as any)['pFlags'] !== undefined && (otherSprite as any)['pFlags'] !== undefined) {
                handler(sprite as platformer.PlatformerSprite, otherSprite as platformer.PlatformerSprite)
            }
        })
    }

    function getLocAt(location: tiles.Location, position: TileDirection): tiles.Location {
        if (position === TileDirection.Center) {
            return location;
        } else {
            return location.getNeighboringLocation(position as number as CollisionDirection)
        }
    }
}