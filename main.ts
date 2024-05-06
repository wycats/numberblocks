namespace SpriteKind {
    export const NPC = SpriteKind.create()
}
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
