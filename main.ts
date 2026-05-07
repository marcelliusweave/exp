// Mario-like Game with myImage character and level 0 tilemap
let myImage: Sprite
let level0Tilemap: TileMap
let isJumping = false
let velocityY = 0
let health = 100
let score = 0
let gameOver = false
let won = false

// Initialize game
function initGame() {
    // Create the player sprite (myImage)
    myImage = sprites.create(img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . f f f f . . . . . . . . .
        . . f f f f f f . . . . . . . .
        . . f f 1 1 f f . . . . . . . .
        . . f 1 1 1 1 f . . . . . . . .
        . . f f 1 1 f f . . . . . . . .
        . . . f f f f . . . . . . . . .
        . . . . f f . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `, SpriteKind.Player)
    
    myImage.setPosition(20, 100)
    
    // Create level 0 tilemap
    level0Tilemap = tiles.loadTilemap(tilemap`level0`)
    tiles.setTilemap(level0Tilemap)
    
    // Set camera to follow player
    scene.cameraFollowSprite(myImage)
    
    // Create enemies
    createEnemies()
    
    // Initialize HUD
    updateHUD()
}

// Create enemies that patrol the level
function createEnemies() {
    let enemy1 = sprites.create(img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . f f f f . . . . . . . .
        . . . f f f f f f . . . . . . .
        . . . f 2 2 2 2 f . . . . . . .
        . . . f 2 f 2 f f . . . . . . .
        . . . f 2 2 2 2 f . . . . . . .
        . . . . f f f f . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `, SpriteKind.Enemy)
    enemy1.setPosition(80, 80)
    enemy1.setVelocity(40, 0)
    
    let enemy2 = sprites.create(img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . f f f f . . . . . . . .
        . . . f f f f f f . . . . . . .
        . . . f 2 2 2 2 f . . . . . . .
        . . . f 2 f 2 f f . . . . . . .
        . . . f 2 2 2 2 f . . . . . . .
        . . . . f f f f . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `, SpriteKind.Enemy)
    enemy2.setPosition(150, 100)
    enemy2.setVelocity(-40, 0)
}

// Handle player movement
function handleMovement() {
    if (controller.left.isPressed()) {
        myImage.vx = -80
        myImage.image.flipX = true
    } else if (controller.right.isPressed()) {
        myImage.vx = 80
        myImage.image.flipX = false
    } else {
        myImage.vx = 0
    }
}

// Handle jumping
function handleJumping() {
    if (controller.A.isPressed() && !isJumping) {
        velocityY = -200
        isJumping = true
        music.play(music.tonePlayable(440, music.beat(BeatFraction.Sixteenth)), music.PlaybackMode.UntilDone)
    }
}

// Handle shooting
function handleShooting() {
    if (controller.B.isPressed()) {
        shootBullet()
    }
}

// Create and fire a bullet
function shootBullet() {
    let bullet = sprites.create(img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . f f . . . . . . . .
        . . . . . . f f . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `, SpriteKind.Projectile)
    
    bullet.setPosition(myImage.x, myImage.y - 5)
    
    if (myImage.image.isFlipped()) {
        bullet.vx = -150
    } else {
        bullet.vx = 150
    }
    
    music.play(music.tonePlayable(523, music.beat(BeatFraction.Eighth)), music.PlaybackMode.UntilDone)
}

// Apply gravity and handle collision
function updatePhysics() {
    velocityY += 400 * (game.runtime() / 1000)
    myImage.vy = velocityY
    
    // Check if on ground
    if (tiles.tileAtLocationIsWall(tiles.locationOfSprite(myImage)) && velocityY >= 0) {
        velocityY = 0
        isJumping = false
    } else if (myImage.y > 180) {
        // Fall off bottom = damage
        health -= 10
        myImage.setPosition(20, 100)
        velocityY = 0
        isJumping = false
    }
}

// Check collisions between bullets and enemies
function checkBulletCollisions() {
    for (let projectile of sprites.allOfKind(SpriteKind.Projectile)) {
        let hit = false
        for (let enemy of sprites.allOfKind(SpriteKind.Enemy)) {
            if (projectile.overlapsWith(enemy)) {
                projectile.destroy()
                enemy.destroy()
                score += 10
                hit = true
                music.play(music.tonePlayable(800, music.beat(BeatFraction.Sixteenth)), music.PlaybackMode.UntilDone)
            }
        }
    }
}

// Check collisions between player and enemies
function checkEnemyCollisions() {
    for (let enemy of sprites.allOfKind(SpriteKind.Enemy)) {
        if (myImage.overlapsWith(enemy)) {
            health -= 5
            myImage.setPosition(20, 100)
            velocityY = 0
            isJumping = false
            music.play(music.tonePlayable(200, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
        }
    }
}

// Enemy patrol behavior
function updateEnemies() {
    for (let enemy of sprites.allOfKind(SpriteKind.Enemy)) {
        // Reverse direction at boundaries
        if (enemy.x < 20 || enemy.x > 150) {
            enemy.vx = -enemy.vx
        }
    }
}

// Update HUD
function updateHUD() {
    info.setLife(health)
    info.setScore(score)
}

// Check win/lose conditions
function checkGameStatus() {
    if (health <= 0) {
        gameOver = true
        game.over(LOSE)
    }
    
    if (sprites.allOfKind(SpriteKind.Enemy).length == 0 && !won) {
        won = true
        game.over(WIN)
    }
}

// Clean up bullets that go off screen
function cleanupBullets() {
    for (let projectile of sprites.allOfKind(SpriteKind.Projectile)) {
        if (projectile.x < -10 || projectile.x > 170) {
            projectile.destroy()
        }
    }
}

// Main game loop
initGame()

game.onUpdate(function() {
    if (!gameOver && !won) {
        handleMovement()
        handleJumping()
        handleShooting()
        updatePhysics()
        checkBulletCollisions()
        checkEnemyCollisions()
        updateEnemies()
        cleanupBullets()
        updateHUD()
        checkGameStatus()
    }
})
