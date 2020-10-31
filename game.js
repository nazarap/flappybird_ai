window.fbGame = canvasElID => {
    const GAME_STATES = {
        INIT: 0,
        READY: 1,
        PLAY: 2,
        DEAD: 3,
    }

    let gameState = GAME_STATES.INIT
    let lastScore = 0
    let score = 0
    let distance = 0
    let gameSpeed = 2
    const canvas = document.getElementById(canvasElID)
    const ctx = canvas.getContext('2d')
    const { width, height } = canvas
    const playHeight = height - 112

    const root = `/${location.pathname.split('/')[1]}/`
    const sprite = {
        bg: root + 'assets/background.png',
        ground: root + 'assets/ground.png',
        bird: root + 'assets/bird.png',
        botpipe: root + 'assets/botpipe.png',
        toppipe: root + 'assets/toppipe.png',
    }

    const createSprite = imagePath => {
        const image = new Image();
        image.src = imagePath;
        return image;
    }

    const pipeImages = {
        top: createSprite(sprite.toppipe),
        bottom: createSprite(sprite.botpipe)
    }

    const background = {
        sprite: createSprite(sprite.bg),
        x: 0,
        y: height / 2,
        draw () {
            ctx.fillStyle = 'lightblue';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(this.sprite, this.x, this.y, width, width)
        }
    }

    const bird = () => ({
        sprite: createSprite(sprite.bird),
        x: 40,
        y: height / 5,
        width: 34,
        height: 26,
        gravity: 3,
        timeout: null,
        isDead: false,
        isFlap: false,
        init () {
            this.isDead = false
            this.isFlap = false
            this.x = 40
            this.y = height / 5 + Math.floor(Math.random() * 20) + 10
            this.gravity = 3
            if(this.timeout) clearTimeout(this.timeout)
        },
        box () {
            const self = this
            return {
                x1: self.x +5,
                y1: self.y +5,
                x2: self.x + self.width -5,
                y2: self.y + self.height -5
            }
        },
        check () {
            if (this.y + this.height > playHeight) {
                this.isDead = true
            }
            pipes.list.forEach(pipe => {
                const {x1, x2, ty, by} = pipe.box()
                const birdBox = this.box()

                if ((birdBox.x2 > x1 && birdBox.x1 < x2) && (birdBox.y1 < ty || birdBox.y2 > by)) {
                    this.isDead = true
                }
            })
        },
        flap () {
            this.isFlap = true
            if(this.timeout) clearTimeout(this.timeout)
            this.gravity = -2.6
            this.timeout = setTimeout(() => {
                this.gravity = 1.5
                this.timeout = setTimeout(() => (this.gravity = 3), 500)
            }, 500)
        },
        update () {
            if (this.isDead) return

            this.y += this.gravity
            this.check()
        },
        draw () {
            if (this.isDead) return

            ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height)
        }
    })

    const birds = {
        list: [],
        drawAll () {
            this.list.forEach(b => b.draw())
        },
        updateAll () {
            const firstBird = this.list[0]
            const firstBirdBox = firstBird.box()
            pipes.list.forEach(pipe => {
                const pipeBox = pipe.box()
                if (pipeBox.x2 === firstBirdBox.x1 + gameSpeed) {
                    ++score
                }
            })
            const hasAlive = this.list.some(b => !b.isDead)
            if (!hasAlive) {
                gameState = GAME_STATES.DEAD
                lastScore = score
                score = 0
                return
            }

            this.list.forEach(b => b.update())
        },
        initAll () {
            this.list.forEach(b => b.init())
        },
    }

    const pipe = ({x = 0, y = 0}) => ({
        x,
        y,
        ty: y - 400,
        by: y + 150,
        height: 52,
        box () {
            const {x, y, by, height} = this
            return {
                x1: x,
                x2: x + height,
                ty: y,
                by: by
            }
        },
        update () {
            this.x -= gameSpeed
        },
        draw () {
            ctx.drawImage(pipeImages.top, this.x, this.ty)
            ctx.drawImage(pipeImages.bottom, this.x, this.by)
        }
    })

    const randomY = () => {
        return Math.floor(Math.random() * (playHeight - 250)) + 50
    }

    const getNextPipe = () => {
        return pipes.list.find(pipe => {
            const { x2 } = pipe.box()
            const birdBox = birds.list[0].box()

            if (birdBox.x1 > x2) return
            return pipe
        })
    }

    const pipes = {
        height: 52,
        list: [],
        init () {
            this.list = [
                pipe({
                    x: width / 2,
                    y: randomY()
                }),
                pipe({
                    x: (width / 2) + 200,
                    y: randomY()
                })
            ]
        },
        drawAll () {
            this.list.forEach(p => p.draw())
        },
        updateAll () {
            const firstPipe = this.list[0]
            const lastPipe = this.list[this.list.length - 1]
            if (lastPipe && lastPipe.x < width - 200) {
                const newY = randomY()
                this.list.push(
                    pipe({
                        x: lastPipe.x + 200,
                        y: newY
                    })
                )
            }
            if (firstPipe && firstPipe.x < -this.height) {
                this.list.shift()
            }
            this.list.forEach(p => p.update())
        }
    }

    const ground = {
        sprite: createSprite(sprite.ground),
        x: 0,
        y: playHeight,
        draw () {
            ctx.drawImage(this.sprite, this.x, this.y)
        }
    }

    const text = {
        drawText (text, x, y, { font, lineWidth, textAlign, strokeStyle, fillStyle} = {}) {
            ctx.textAlign = textAlign || 'start'
            ctx.font = `100 ${font || 50}px FlappyBird`
            ctx.strokeStyle = strokeStyle || 'black'
            ctx.lineWidth = lineWidth || 6
            ctx.strokeText(text, x + 1, y + 1.5)
            ctx.fillStyle = fillStyle || 'white'
            ctx.fillText(text, x, y)
        },
        draw () {
            switch (gameState) {
                case GAME_STATES.READY:
                    this.drawText('GET READY', width / 2, height / 2 - 50, { textAlign: 'center', strokeStyle: '#212121', fillStyle: '#fb8c00' })
                    this.drawText('Press <Space>', width / 2, height / 2, { font: 20, textAlign: 'center', lineWidth: 3 })
                    break
                case GAME_STATES.PLAY:
                    this.drawText(score.toString(), 20, 60)
                    break
                case GAME_STATES.DEAD:
                    this.drawText(lastScore.toString(), width / 2, height / 2 - 100, { font: 70, textAlign: 'center' })
                    this.drawText('GAME OVER', width / 2, height / 2, { textAlign: 'center', strokeStyle: '#212121', fillStyle: '#fb8c00' })
                    this.drawText('Press <Space> to try again', width / 2, height / 2 + 50, { font: 20, lineWidth: 3, textAlign: 'center' })
                    break
            }
        }
    }

    const draw = () => {
        background.draw()
        pipes.drawAll()
        birds.drawAll()
        ground.draw()
        text.draw()
    }

    const update = () => {
        distance += 2
        pipes.updateAll()
        birds.updateAll()
    }

    const initGame = () => {
        gameState = GAME_STATES.READY
        pipes.init()
        birds.initAll()

        draw()
    }

    const gameLoop = loopFn => {
        if (loopFn) loopFn(gameState, score)
        update()
        draw()

        if (gameState === GAME_STATES.DEAD) {
            if (loopFn) loopFn(GAME_STATES.DEAD, score)
            distance = 0
            return
        }
        gameState = GAME_STATES.PLAY
        requestAnimationFrame(() => gameLoop(loopFn))
    }

    return {
        getDistance () {
            return distance
        },
        addBird () {
            const b = bird()
            birds.list.push(b)

            return b
        },
        initGame: initGame,
        gameLoop: gameLoop,
        getNextPipe: getNextPipe,
        GAME_STATES,
        reset () {
            lastScore = score
            score = 0
            gameState = GAME_STATES.DEAD
        },
        currentState () {
            return gameState
        }
    }
}
