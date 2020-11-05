(() => {
    const Neuron = window.Neuron
    const Connection = window.Connection

    class Network {
        constructor(input = 2, ...others) {
            if (others && others.length > 0) {
                this.inputSize = input
                this.outputSize = others ? others.pop() : 1
                this.hiddenSizes = others || []

                let neuronIndex = 0
                this.inputs = this._loop(this.inputSize, () => new Neuron(++neuronIndex, 'input'))
                this.hiddenLayers = this.hiddenSizes.map((size, lIndex) => this._loop(size, () => new Neuron(++neuronIndex, lIndex + 1)))
                this.outputs = this._loop(this.outputSize, () => new Neuron(++neuronIndex, 'output'))

                this.connections = []

                this.initConnection()
            }
        }

        initConnection () {
            this.connections = []

            this.hiddenLayers.forEach((layer, lIndex) => {
                layer.forEach(hiddenNeuron => {
                    if (lIndex === 0) {
                        this.inputs.forEach(neuron => {
                            this.connections.push(new Connection(neuron.id, hiddenNeuron.id))
                        })
                    } else {
                        this.hiddenLayers[lIndex - 1].forEach(neuron => {
                            this.connections.push(new Connection(neuron.id, hiddenNeuron.id))
                        })
                    }
                })
            })

            this.hiddenLayers[this.hiddenLayers.length - 1].forEach(hiddenNeuron => {
                this.outputs.forEach(neuron => {
                    this.connections.push(new Connection(hiddenNeuron.id, neuron.id))
                })
            })
        }

        toJSON () {
            return {
                neurons: [...this.inputs, ...this.hiddenLayers.reduce((a, c) => ([...a, ...c]), []), ...this.outputs].map((neuron => neuron.toJSON())),
                connections: this.connections.map((connection => connection.toJSON()))
            }
        }

        static fromJSON (json) {
            const inputs = []
            const outputs = []
            const hiddenLayers = []
            const connections = json.connections.map((connection => new Connection(connection.from, connection.to, connection.weight)))

            json.neurons.forEach((({id, layer, bias}) => {
                switch (layer) {
                    case 'input':
                        inputs.push(new Neuron(id, layer, bias))
                        break
                    case 'output':
                        outputs.push(new Neuron(id, layer, bias))
                        break
                    default:
                        if (!hiddenLayers[layer - 1]) {
                            hiddenLayers[layer - 1] = []
                        }
                        hiddenLayers[layer - 1].push(new Neuron(id, layer, bias))
                }
            }))

            const network = new Network()
            network.inputs = inputs
            network.outputs = outputs
            network.hiddenLayers = hiddenLayers
            network.connections = connections

            return network
        }

        _loop (size, fn) {
            return [...new Array(size)].map((_, index) => fn(index))
        }

        _findNeuron (id) {
            for (const layer of [this.inputs, ...this.hiddenLayers, this.outputs]) {
                const neuron = layer.find(neuron => neuron.id === id)
                if (neuron) return neuron
            }
        }

        activate (inputs) {
            inputs.forEach((input, index) => (this.inputs[index].activation = input))

            let toNeuron = null
            let activateSumInput = 0
            this.connections.forEach(({from, to, weight}) => {
                const fromNeuron = this._findNeuron(from)
                if (toNeuron && toNeuron.id === to) {
                    activateSumInput += (fromNeuron.activation * weight)
                } else {
                    toNeuron && toNeuron.activate(activateSumInput)
                    activateSumInput = fromNeuron.activation * weight
                    toNeuron = this._findNeuron(to)
                }
            })
            return toNeuron.activate(activateSumInput)
        }
    }

    window.Network = Network
})()
