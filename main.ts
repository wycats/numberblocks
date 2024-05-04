namespace SpriteKind {
    export const NPC = SpriteKind.create()
}
tiles.setCurrentTilemap(tilemap`level2`)
let playerSprite = numberblocks.createPlayer(1)
let playerSprite2 = numberblocks.createNumberblock(2)
platformer.runFrames(
playerSprite2,
[img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `],
500,
platformer.rule(platformer.PlatformerSpriteState.Moving, platformer.PlatformerSpriteState.FacingLeft, platformer.PlatformerSpriteState.Turning)
)
