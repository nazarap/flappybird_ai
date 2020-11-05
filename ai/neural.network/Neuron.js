(() => {
    class Neuron {
        constructor(id, layer = 'hidden', bias) {
            this.id = id || (~~(Math.random()*1e8)).toString(16)

            this.bias = bias || (layer !== 'input' ? Math.random() * .2 - .1 : 0)
            this.layer = layer
            this.activation = 0
        }

        sigmoid (x) {
            return 1 / (1 + Math.exp(-x))
        }

        activate (input) {
            if (this.layer === 'input') {
                this.activation = input
                return input
            }
            this.activation = this.sigmoid(input + this.bias)
            return this.activation
        }

        toJSON () {
            return {
                id: this.id,
                bias: this.bias,
                layer: this.layer,
            }
        }
    }

    window.Neuron = Neuron
})()
