(async () => {
    const fbGameUser = window.fbGame('canvasUser')
    const GAME_STATES = fbGameUser.GAME_STATES
    const bird = fbGameUser.addBird()
    const root = `/${location.pathname.split('/')[1]}`

    const requestBirnBrain = async () => {
        return new Promise((res, rej) => {
            fetch(`${root}/genetic.algorithm/best.players/34400.json`)
                .then(response => response.json())
                .then(json => res(json))
                .catch(e => rej(e))
        })
    }

    const birdBrain = await requestBirnBrain()
    const fbGameAI = window.fbGame('canvasAI')
    window.fbGameAI = fbGameAI
    const Unit = window.Unit
    const unitAI = new Unit(0, synaptic.Network.fromJSON(birdBrain))

    const loopAI = () => {
        const pipeBox = fbGameAI.getNextPipe().box()
        const birdBox = unitAI.player.bird.box()

        const inputs = [pipeBox.x1 - birdBox.x2, (pipeBox.ty + 75) - birdBox.y2]
        unitAI.activate(inputs)
    }

    let isAIDead = false
    const pressEvent = () => {
        const gameState = fbGameUser.currentState()
        switch (gameState) {
            // game is not ready
            case GAME_STATES.INIT:
                break
            // game is initialized
            case GAME_STATES.READY:
                isAIDead = false
                fbGameAI.gameLoop(loopAI)
                fbGameUser.gameLoop()
                break
            // game is running
            case GAME_STATES.PLAY:
                bird.flap()
                break
            // game end
            case GAME_STATES.DEAD:
                if (!isAIDead) {
                    isAIDead = true
                    fbGameAI.reset()
                } else {
                    fbGameAI.initGame()
                    fbGameUser.initGame()
                }
        }
    }
    document.addEventListener('touchend', pressEvent, false);
    document.addEventListener('keydown', e => {
        if (e.code === 'Space') {
            pressEvent()
        }
    });

    setTimeout(() => {
        fbGameUser.initGame()
        fbGameAI.initGame()
    }, 100)
})()
