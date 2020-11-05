(() => {
    class Connection {
        constructor(fIndex, tIndex, weight) {
            this.from = fIndex
            this.to = tIndex
            this.weight = weight || Math.random() * .2 - .1
        }

        toJSON () {
            return {
                from: this.from,
                to: this.to,
                weight: this.weight
            }
        }
    }

    window.Connection = Connection
})()
