namespace SpriteKind {
    export const NPC = SpriteKind.create()
}
platformer_tiles.onOverlap(SpriteKind.Player, SpriteKind.NPC, function (sprite, otherSprite) {
    sum = numberblocks.getNumberblockNumber(sprite) + numberblocks.getNumberblockNumber(otherSprite)
    if (numberblocks.isNumberblockAvailable(sum) && platformer.hasState(sprite, platformer.PlatformerSpriteState.OnGround)) {
        platformer.setCharacterAnimationsEnabled(otherSprite, false)
        sprites.destroy(otherSprite, effects.warmRadial, 500)
        numberblocks.assign(sprite, sum)
    }
})
scene.onOverlapTile(SpriteKind.Player, myTiles.tile15, function (sprite, location) {
    timer.throttle("magic-mirror", 2000, function () {
        platformer_tiles.ifAvailable(location, CollisionDirection.Right, function (available) {
            numberblock = numberblocks.createNumberblock()
            npcs.push(numberblock)
            platformer_tiles.insertSprite(numberblock, available)
        })
    })
})
let numberblock: platformer.PlatformerSprite = null
let sum = 0
let npcs: platformer.PlatformerSprite[] = []
tiles.setCurrentTilemap(tilemap`level2`)
npcs = numberblocks.createNumberblocks()
let playerSprite = numberblocks.createPlayer()
