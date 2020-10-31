(() => {
    const Player = window.Player

    class Unit {
        constructor(index = 0, brain) {
            this.player = new Player() // connection with UI
            this.suitability = 0
            this.index = index
            this.score = 0
            this.isWinner = false
            this.brain = brain || new synaptic.Architect.Perceptron(2, 10, 1)
        }

        activate (inputs) {
            const outputs = this.brain.activate(inputs);

            this.player.makeAction(outputs) // connection with UI

            return outputs
        }

        toJSON () {
            return this.brain.toJSON()
        }
    }

    window.Unit = Unit
})()
