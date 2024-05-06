namespace SpriteKind {
    export const NPC = SpriteKind.create()
}
platformer_tiles.onOverlap(SpriteKind.Player, SpriteKind.NPC, function (sprite, otherSprite) {
    sum = numberblocks.getNumberblockNumber(sprite) + numberblocks.getNumberblockNumber(null)
    if (numberblocks.isNumberblockAvailable(sum) && platformer.hasState(sprite, platformer.PlatformerSpriteState.OnGround)) {
        numberblocks.destroy(otherSprite)
        sprites.destroy(otherSprite, effects.warmRadial, 500)
        numberblocks.assign(sprite, sum)
    }
})
scene.onOverlapTile(SpriteKind.Player, myTiles.tile15, function (sprite, location) {
    timer.throttle("magic-mirror", 2000, function () {
        platformer_tiles.ifAvailable(location, CollisionDirection.Right, function (available) {
            numberblock = numberblocks.createNumberblockNPC(1, available)
        })
    })
})
let numberblock: numberblocks.Numberblock = null
let sum = 0
let playerSprite = numberblocks.createNumberblockPlayer()
let npcs = numberblocks.createNumberblocks()
tiles.setCurrentTilemap(tilemap`level2`)
