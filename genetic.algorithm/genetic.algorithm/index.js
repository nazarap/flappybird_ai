(() => {
    const Population = window.Population

    class GeneticAlgorithm {
        constructor(maxUnits = 10, topUnits = 4) {
            this.maxUnits = maxUnits
            this.topUnits = topUnits

            if (topUnits > maxUnits)
                this.topUnits = this.maxUnits

            this.init()
        }

        init () {
            this.population = new Population(this.maxUnits)
            this.iteration = 1
            this.mutateRate = 1

            this.bestPopulation = 0
            this.bestSuitability = 0
            this.bestScore = 0
        }

        loop (box, suitability) {
            this.population.filterAlive().forEach(unit => {
                const birdBox = unit.player.bird.box()
                unit.suitability = suitability
                unit.score = this.population.score

                const inputs = [box.x1 - birdBox.x2, (box.ty + 75) - birdBox.y2]
                unit.activate(inputs)
            })
        }

        selection () {
            const sortedUnits = this.population.sortedSuitability()

            console.log(sortedUnits.map(i => i.suitability))
            const bestUnits = []

            for (let i = 0; i < this.topUnits; i++) {
                sortedUnits[i].isWinner = true

                bestUnits.push(sortedUnits[i])
            }

            return bestUnits
        }

        evolvePopulation () {
            this.iteration++
            const bestUnits = this.selection()

            if (bestUnits[0].suitability > this.bestSuitability){
                this.bestPopulation = this.iteration
                this.bestSuitability = bestUnits[0].suitability
                this.bestScore = this.population.score
            }

            if (this.mutateRate === 1 && bestUnits[0].suitability < 0){
                this.createUnits()
            } else {
                this.mutateRate = 0.2
            }

            for (let i = 0; i < this.topUnits; i++){
                bestUnits[i].suitability = 0
                bestUnits[i].score = 0
            }

            for (let i = this.topUnits; i < this.maxUnits; i++){
                let parentA, parentB, offspring

                if (i === this.topUnits){
                    parentA = bestUnits[0].toJSON()
                    parentB = bestUnits[1].toJSON()
                    offspring = this.crossover(parentA, parentB)

                } else if (i < this.maxUnits - 2){
                    parentA = this.getRandomUnit(bestUnits).toJSON()
                    parentB = this.getRandomUnit(bestUnits).toJSON()
                    offspring = this.crossover(parentA, parentB)
                } else {
                    offspring = this.getRandomUnit(bestUnits).toJSON()
                }

                offspring = this.mutation(offspring)

                this.population.units[i] = new Unit(this.population.units[i].index, synaptic.Network.fromJSON(offspring))
            }
            this.population.score = 0
        }

        crossover (parentA, parentB) {
            const cutPoint = this.random(0, parentA.neurons.length - 1)

            for (let i = cutPoint; i < parentA.neurons.length; i++){
                let biasFromParentA = parentA.neurons[i]['bias']
                parentA.neurons[i]['bias'] = parentB.neurons[i]['bias']
                parentB.neurons[i]['bias'] = biasFromParentA
            }

            return this.random(0, 1) === 1 ? parentA : parentB
        }

        mutation (offspring) {
            for (let i = 0; i < offspring.neurons.length; i++){
                offspring.neurons[i]['bias'] = this.mutate(offspring.neurons[i]['bias'])
            }

            for (let i = 0; i < offspring.connections.length; i++){
                offspring.connections[i]['weight'] = this.mutate(offspring.connections[i]['weight'])
            }

            return offspring
        }

        mutate (gene) {
            if (Math.random() < this.mutateRate) {
                const mutateFactor = 1 + ((Math.random() - 0.5) * 3 + (Math.random() - 0.5))
                gene *= mutateFactor
            }

            return gene
        }

        random (min, max) {
            return Math.floor(Math.random() * (max-min+1) + min)
        }

        getRandomUnit (arr) {
            return arr[this.random(0, arr.length - 1)]
        }
    }

    window.GeneticAlgorithm = GeneticAlgorithm
})()
