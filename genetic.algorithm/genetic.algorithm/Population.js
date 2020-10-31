(() => {
    const Unit = window.Unit

    class Population {
        constructor(maxUnits = 10) {
            this.maxUnits = maxUnits
            this.units = []
            this.score = 0

            this.createUnits()
        }

        filterAlive () {
            return this.units.filter(unit => unit.player.alive())
        }

        sortedSuitability () {
            return this.units.sort((u1, u2) => u2.suitability - u1.suitability)
        }

        createUnits () {
            this.units = []
            for (let i = 0; i < this.maxUnits; i++) {
                const unit = new Unit(i)
                this.units.push(unit)
            }
        }
    }

    window.Population = Population
})()
