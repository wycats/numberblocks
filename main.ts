namespace SpriteKind {
    export const NPC = SpriteKind.create()
}
scene.onOverlapTile(SpriteKind.Player, myTiles.tile15, function (sprite, location) {
    console.log(location)
    timer.throttle("magic-mirror", 2000, function () {
        platformer_tiles.ifAvailable(location, CollisionDirection.Right, function (available) {
            numberblocks.createNumberblockNPCAt(available)
        })
    })
})
let sum = 0
let other = 0
let playerSprite = numberblocks.createNumberblockPlayer()
let npcs = numberblocks.createNumberblocks()
tiles.setCurrentTilemap(tilemap`level2`)
numberblocks.onOverlap(playerSprite, NumberblockKind.NPC, function (other) {
    sum = playerSprite.numberblock + other.numberblock
    if (numberblocks.isNumberblockAvailable(sum) && platformer.hasState(playerSprite.sprite, platformer.PlatformerSpriteState.OnGround)) {
        other.destroy(effects.starField)
        playerSprite.numberblock = sum
    }
})
