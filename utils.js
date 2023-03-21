//detecting for collision:
//checking if the attack box is hitting or past the enemy
//checking if the bottom of the player attack is above or below the enemy
function rectangularCollision({ rectangle1, rectangle2 }) {
    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height)
}

//putting final health calculation logic into a function
function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId)
    document.querySelector('#displayResult').style.display = "flex"

    if (player.health === enemy.health) {
        document.querySelector('#displayResult').innerHTML = "Tie!"
    } else if (player.health > enemy.health) {
        document.querySelector('#displayResult').innerHTML = "Player 1 wins!"
    } else if (player.health < enemy.health) {
        document.querySelector('#displayResult').innerHTML = "Player 2 wins!"
    }
}

//making the timer loop until it reaches 0 and targetting the timer div
let timer = 46
let timerId

//timer countdown function with display text at the end
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }
    if (timer === 0) {
        determineWinner({ player, enemy, timerId })
    }
}