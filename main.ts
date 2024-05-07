namespace SpriteKind {
    export const NPC = SpriteKind.create()
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile13`, function (sprite, location) {
    timer.throttle("magic-mirror", 2000, function () {
        platformer_tiles.ifAvailable(location, CollisionDirection.Right, function (available) {
            numberblocks.createNumberblockNPCAt(available, 1)
        })
    })
})
numberblocks.onPlayerOverlap(function (player2, numberblock) {
    sum = player2.numberblock + numberblock.numberblock
    if (numberblocks.isNumberblockAvailable(sum) && platformer.hasState(player2.sprite, platformer.PlatformerSpriteState.OnGround)) {
        numberblock.destroy(effects.starField)
        player2.numberblock = sum
    }
})
let sum = 0
let playerSprite = numberblocks.createNumberblockPlayer()
let npcs = numberblocks.createNumberblocks()
tiles.setCurrentTilemap(tilemap`level2`)
