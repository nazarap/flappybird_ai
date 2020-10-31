(() => {

    class Player {
        constructor() {
            const fbGameAI = window.fbGameAI

            this.bird = fbGameAI.addBird()

            fbGameAI.initGame()
        }

        makeAction (output) {
            if (output > 0.5)
                this.bird.flap()
        }

        alive () {
            return !this.bird.isDead
        }
    }

    window.Player = Player
})()