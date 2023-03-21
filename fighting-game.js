//select the HTML canvas and give it a 2d context to use
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

//constant for the Y axis to use when influencing the character 'downward'
const gravity = 0.5

//size of canvas
canvas.width = 1024;
canvas.height = 576;

//fill out the canvas
ctx.fillRect(0, 0, canvas.width, canvas.height)

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './images/oak_woods_V1.0/background/background.png'
})

const shop = new Sprite({
    position: {
        x: 625,
        y: 162
    },
    imageSrc: './images/oak_woods_v1.0/decorations/shop_anim.png',
    scale: 2.5,
    framesMax: 6
})



//making the player sprite
const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './images/Martial_Hero/Sprites/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './images/Martial_Hero/Sprites/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './images/Martial_Hero/Sprites/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './images/Martial_Hero/Sprites/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './images/Martial_Hero/Sprites/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './images/Martial_Hero/Sprites/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './images/Martial_Hero/Sprites/Take Hit.png',
            framesMax: 4
        },
        death: {
            imageSrc: './images/Martial_Hero/Sprites/Death.png',
            framesMax: 6
        },
    },
    attackBox: {
        offset: {
            x: 120,
            y: 20
        },
        width: 135,
        height: 95
    }
})

//making the enemy sprite
const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: "blue",
    offset: {
        x: -100,
        y: 0
    },
    imageSrc: './images/Martial_Hero_2/Sprites/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 170
    },
    sprites: {
        idle: {
            imageSrc: './images/Martial_Hero_2/Sprites/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './images/Martial_Hero_2/Sprites/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './images/Martial_Hero_2/Sprites/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './images/Martial_Hero_2/Sprites/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './images/Martial_Hero_2/Sprites/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './images/Martial_Hero_2/Sprites/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './images/Martial_Hero_2/Sprites/Death.png',
            framesMax: 7
        },
    },
    attackBox: {
        offset: {
            x: -165,
            y: 30
        },
        width: 145,
        height: 85
    }
})


//setting keys to false unless pressed in switch case below for more accurate movement
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }

}


//call the above function
decreaseTimer()

//creating the animate function
function animate() {
    //redrawing the black canvas and updating the players for every frame
    window.requestAnimationFrame(animate)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    player.update()
    enemy.update()

    //set base velocity to 0 on the beginning of each frame
    player.velocity.x = 0
    enemy.velocity.x = 0

    //Player movement: If both the key is pressed down AND another key has not been pressed, then adjust velocity

    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }
    //jumping and falling
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    //Enemy movement: (same, but using enemy lastKey to differentiate)
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')

    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')

        if (enemy.velocity.y < 0) {
            enemy.switchSprite('jump')
        } else if (enemy.velocity.y > 0) {
            enemy.switchSprite('fall')
        }
    }

    //checking for collision and making sure attacks can only hit during single key press, plus hit animation
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking && player.framesCurrent === 4) {
        enemy.takeHit()
        player.isAttacking = false
        document.querySelector('#enemyHealth').style.width = enemy.health + "%";
    }

    // if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }

    //left player getting hit
    if (rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
        enemy.isAttacking) {
        player.takeHit()
        enemy.isAttacking = false
        document.querySelector('#playerHealth').style.width = player.health + "%";
    }

    //end game and decide winner if health reaches 0
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId })
    }
}


//call animate from above, it will loop on itself in the browser at around 60 fps
animate()


window.addEventListener('keydown', (event) => {
    if (!player.dead) {
        //player keys
        switch (event.key) {
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break;
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break;
            case 'w':
                player.velocity.y = -15
                player.height = 120
                break;
            case ' ':
                player.attack()
                break;
        }
    }

    if (!enemy.dead) {
        //enemy keys
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break;
            case 'ArrowUp':
                enemy.velocity.y = -15
                enemy.height = 120
                break;
            case '0':
                enemy.attack()
                break;
        }
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        //player on key no longer being pressed
        case 'd':
            keys.d.pressed = false
            break;
        case 'a':
            keys.a.pressed = false
            break;
        case 'w':
            player.height = 150
            break;

        //enemy on key no longer being pressed
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break;
        case 'ArrowUp':
            enemy.height = 150
            break;
    }
})
