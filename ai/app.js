(() => {
    const GeneticAlgorithm = window.GeneticAlgorithm
    const fbGame = window.fbGame('canvas')
    window.fbGameAI = fbGame

    const geneticAlgorithm = new GeneticAlgorithm(10, 4)

    //--- Code to display data about studying on UI
    const bestScoreEl = document.getElementById('bestScoreID')
    const scoreEl = document.getElementById('scoreID')
    const populationEl = document.getElementById('populationID')
    const bestPopulationEl = document.getElementById('bestPopulationID')
    const birdCountEl = document.getElementById('birdCountID')
    birdCountEl.innerText = geneticAlgorithm.maxUnits
    const aliveBirdCountEl = document.getElementById('aliveBirdCountID')
    const updateUIValues = () => {
        bestScoreEl.innerText = geneticAlgorithm.bestScore
        bestPopulationEl.innerText = geneticAlgorithm.bestPopulation
        aliveBirdCountEl.innerText = geneticAlgorithm.population.filterAlive().length.toString()
        populationEl.innerText = geneticAlgorithm.iteration
        scoreEl.innerText = geneticAlgorithm.population.score
    }
    const download = (content, fileName, contentType) => {
        let a = document.createElement('a')
        let file = new Blob([JSON.stringify(content)], { type: contentType })
        a.href = URL.createObjectURL(file)
        a.download = fileName
        a.click()
    }

    const downloadBestAgentEl = document.getElementById('downloadBestAgent')
    downloadBestAgentEl.onclick = () => download(geneticAlgorithm.bestAgent.toJSON(), 'json.json', 'text/plain')
    //---

    const loop = (gameState, score) => {
        switch (gameState) {
            case fbGame.GAME_STATES.INIT:
                break
            case fbGame.GAME_STATES.READY:
                break
            case fbGame.GAME_STATES.PLAY:
                geneticAlgorithm.population.score = score
                const pipeBox = fbGame.getNextPipe().box()

                geneticAlgorithm.loop(pipeBox, fbGame.getDistance())
                break
            case fbGame.GAME_STATES.DEAD:
                geneticAlgorithm.evolvePopulation()

                fbGame.initGame()
                fbGame.gameLoop(loop)
        }
        updateUIValues()
    }

    fbGame.gameLoop(loop)
})()
